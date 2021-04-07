import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dto/sign-in.dto';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  /**
   * Creates a User given sign up credentials.
   * @param dto name, email, and password of the user
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // Create user object
    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: hashedPassword
    });

    // Insert new document
    try {
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  /**
   * Signs in a User.
   * @param dto user's sign in creds (email and password)
   * @returns the user and their new token
   */
  async signIn(dto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.userModel.findOne({ email: dto.email });
    // Check that user exists
    if (!user || user.removed) throw new NotFoundException("No user exists with that email");

    // Compare passwords
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Incorrect password");

    // JWT token
    const payload: JwtPayload = { email: user.email, userId: user._id };
    const token = this.jwtService.sign(payload);
    user.tokens.push(token);
    if (user.tokens.length > 5) {
      user.tokens = user.tokens.slice(user.tokens.length - 5, user.tokens.length);
    }
    user.markModified('tokens'); // ensure that tokens array gets saved

    return {
      user,
      token
    }
  }

  /**
   * Signs a User out (removes the given token).
   * @param userId id of the user requesting to log out
   * @param token the token to remove
   */
  async signOut(reqUser: User, token: string): Promise<void> {
    const user = await this.retrieveUserById(reqUser._id);

    user.tokens = user.tokens.filter(t => t !== token);
    user.markModified('tokens');
    user.save().then();
  }

  /**
   * Gets the user given a token.
   * @param token token to authenticate
   */
  async getUserByToken(token: string): Promise<User> {
    let payload: JwtPayload;
    try {
      payload = <JwtPayload>this.jwtService.decode(token);
    } catch (e) {
      throw new UnauthorizedException("Invalid authentication token");
    }
    const user = await this.userModel.findById(payload.userId);
    if (user && !user.removed) return user;
    else throw new UnauthorizedException("Invalid authentication token");
  }

  /**
   * Updates a User's password.
   * @param dto info to change the password: userId, old pass, and new pass.
   */
  async updateUserPassword(reqUser: User, dto: UpdatePasswordDto): Promise<User> {
    const user = await this.retrieveUserById(reqUser._id);

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) throw new UnauthorizedException("Incorrect password");

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    return user.save();
  }

  /**
   * Reset the User's password.
   * @param dto creds to reset user password (id, key, password)
   */
  async resetUserPassword(dto: ResetPasswordDto): Promise<User> {
    const user = await this.retrieveUserById(dto.userId);

    const valid = dto.key === user.resetKey;
    if (!valid) throw new UnauthorizedException("Invalid reset key");

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    user.password = hashedPassword;
    return user.save();
  }

  /**
   * Gets a list of all users.
   */
  async getAllUsers(excludeRemoved: boolean): Promise<User[]> {
    const cond = excludeRemoved ? { removed: false } : {};
    const users = await this.userModel.find(cond);
    for (const user of users) {
      this.secureUser(user);
    }
    return users;
  }

  /**
   * Get a User by id.
   * @param userId the user id
   */
  async getUserById(reqUser: User): Promise<User> {
    const user = await this.userModel.findById(reqUser._id);
    if (!user) throw new NotFoundException("User not found");
    this.secureUser(user);
    return user;
  }

  /**
   * Sets whether a User is an admin.
   * @param userId user id
   * @param boolValue true to set to admin, false to unset
   */
  async setAdmin(userId: string, boolValue: boolean): Promise<User> {
    const user = await this.retrieveUserById(userId);
    this.secureUser(user);
    return await this.modifyUserProp(user, 'admin', boolValue);
  }

  /**
   * Updates a User's email.
   * @param userId user id
   * @param newEmail new email
   */
  async setEmail(reqUser: User, newEmail: string): Promise<User> {
    return await this.modifyUserProp(reqUser, 'email', newEmail);
  }

  /**
   * Updates a User's bio.
   * @param userId user id
   * @param newBio new bio
   */
  async setBio(reqUser: User, newBio: string): Promise<User> {
    return await this.modifyUserProp(reqUser, 'bio', newBio);
  }

  /**
   * Sets whether a User is removed from the site (cannot log in).
   * @param userId user id
   * @param boolValue true to remove, false to unremove
   */
  async setRemoved(userId: string, boolValue: boolean): Promise<User> {
    const user = await this.userModel.findById(userId);
    this.secureUser(user);
    return await this.modifyUserProp(user, 'removed', boolValue);
  }

  /**
   * Request a password request. Generates a key and emails a link to the User that
   * automatically plugs in this link to the site, allowing them to change their password from
   * there.
   * @param userId
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.removed) throw new NotFoundException("User not found");

    const key = this.generateResetKey();
    const href = `${process.env.FRONTEND_URL}/reset/${user._id}/${key}`;
    const to = [ user.email ];
    const subject = "Husky Husky Password Reset Request";
    const content = `
      <html>
        <p>Hi there,</p>
        <p>
        Someone requested a password reset for your Husky Husky account.
        If this was you, click <a href="${href}">here</a> to reset your password.
        Otherwise, please disregard this email.
        </p>
        <p>
        The Husky Husky Team
        </p>
      </html>
    `;
    this.emailService.sendMail(to, subject, content).then();
    user.resetKey = key;
    await user.save();
  }

  /**
   * Retrieves a User from the database by ID, or throws an error if not found.
   * @param userId id of the user to retrieve
   * @private
   */
  private async retrieveUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    // Check that user exists & is not removed
    if (!user || user.removed) throw new NotFoundException("User not found");
    return user;
  }

  /**
   * Sets one property of a User to the new value.
   * @param user User to modify
   * @param propKey key of the property to modify
   * @param newValue new value of the property
   * @private
   */
  private async modifyUserProp(user: User, propKey: string, newValue: any): Promise<User> {
    user[propKey] = newValue;
    return user.save();
  }

  /**
   * Generate a random reset key (hex string).
   * @private
   */
  private generateResetKey(): string {
    const n = Math.floor(Math.random() * 16777215); // max is FFFFFF(base 16)
    return n.toString(16);
  }

  /**
   * Removes all sensitive data from a User object.
   * @param user
   * @private
   */
  private secureUser(user: User) {
    delete user.tokens;
    delete user.resetKey;
    delete user.password;
  }
}
