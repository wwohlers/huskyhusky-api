"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const email_service_1 = require("../email/email.service");
let UsersService = class UsersService {
    constructor(userModel, jwtService, emailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async createUser(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = new this.userModel({
            name: dto.name,
            email: dto.email,
            password: hashedPassword
        });
        try {
            return await user.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('User already exists');
            }
            throw error;
        }
    }
    async signIn(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user || user.removed)
            throw new common_1.NotFoundException("No user exists with that email");
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException("Incorrect password");
        const payload = { email: user.email, userId: user._id };
        const token = this.jwtService.sign(payload);
        user.tokens.push(token);
        if (user.tokens.length > 5) {
            user.tokens = user.tokens.slice(user.tokens.length - 5, user.tokens.length);
        }
        user.markModified('tokens');
        return {
            user,
            token
        };
    }
    async signOut(reqUser, token) {
        const user = await this.retrieveUserById(reqUser._id);
        user.tokens = user.tokens.filter(t => t !== token);
        user.markModified('tokens');
        user.save().then();
    }
    async getUserByToken(token) {
        let payload;
        try {
            payload = this.jwtService.decode(token);
        }
        catch (e) {
            throw new common_1.UnauthorizedException("Invalid authentication token");
        }
        const user = await this.userModel.findById(payload.userId);
        if (user && !user.removed)
            return user;
        else
            throw new common_1.UnauthorizedException("Invalid authentication token");
    }
    async updateUserPassword(reqUser, dto) {
        const user = await this.retrieveUserById(reqUser._id);
        const valid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException("Incorrect password");
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        user.password = hashedPassword;
        return user.save();
    }
    async resetUserPassword(dto) {
        const user = await this.retrieveUserById(dto.userId);
        const valid = dto.key === user.resetKey;
        if (!valid)
            throw new common_1.UnauthorizedException("Invalid reset key");
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        user.password = hashedPassword;
        return user.save();
    }
    async getAllUsers(excludeRemoved) {
        const cond = excludeRemoved ? { removed: false } : {};
        const users = await this.userModel.find(cond);
        for (const user of users) {
            this.secureUser(user);
        }
        return users;
    }
    async getUserById(reqUser) {
        const user = await this.userModel.findById(reqUser._id);
        if (!user)
            throw new common_1.NotFoundException("User not found");
        this.secureUser(user);
        return user;
    }
    async setAdmin(userId, boolValue) {
        const user = await this.retrieveUserById(userId);
        this.secureUser(user);
        return await this.modifyUserProp(user, 'admin', boolValue);
    }
    async setEmail(reqUser, newEmail) {
        return await this.modifyUserProp(reqUser, 'email', newEmail);
    }
    async setBio(reqUser, newBio) {
        return await this.modifyUserProp(reqUser, 'bio', newBio);
    }
    async setRemoved(userId, boolValue) {
        const user = await this.userModel.findById(userId);
        this.secureUser(user);
        return await this.modifyUserProp(user, 'removed', boolValue);
    }
    async requestPasswordReset(email) {
        const user = await this.userModel.findOne({ email });
        if (!user || user.removed)
            throw new common_1.NotFoundException("User not found");
        const key = this.generateResetKey();
        const href = `${process.env.FRONTEND_URL}/reset/${user._id}/${key}`;
        const to = [user.email];
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
    async retrieveUserById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user || user.removed)
            throw new common_1.NotFoundException("User not found");
        return user;
    }
    async modifyUserProp(user, propKey, newValue) {
        user[propKey] = newValue;
        return user.save();
    }
    generateResetKey() {
        const n = Math.floor(Math.random() * 16777215);
        return n.toString(16);
    }
    secureUser(user) {
        delete user.tokens;
        delete user.resetKey;
        delete user.password;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService,
        email_service_1.EmailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map