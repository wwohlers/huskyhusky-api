import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SingleStringDto } from '../dto/single-string.dto';
import { AuthorizedRequest } from './interfaces/authorized-request.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SingleBoolDto } from '../dto/single-bool.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(dto: CreateUserDto): Promise<import("./interfaces/user.interface").User>;
    signIn(dto: SignInDto): Promise<import("../dto/sign-in-response.dto").SignInResponseDto>;
    signOut(req: AuthorizedRequest): Promise<void>;
    me(req: AuthorizedRequest): Promise<import("./interfaces/user.interface").User>;
    updatePassword(req: AuthorizedRequest, dto: UpdatePasswordDto): Promise<import("./interfaces/user.interface").User>;
    resetPassword(dto: ResetPasswordDto): Promise<import("./interfaces/user.interface").User>;
    getAll(req: any): Promise<import("./interfaces/user.interface").User[]>;
    getUserById(params: any): Promise<import("./interfaces/user.interface").User>;
    setAdmin(params: any, dto: SingleBoolDto): Promise<import("./interfaces/user.interface").User>;
    setEmail(req: AuthorizedRequest, dto: SingleStringDto): Promise<import("./interfaces/user.interface").User>;
    setBio(req: AuthorizedRequest, dto: SingleStringDto): Promise<import("./interfaces/user.interface").User>;
    setRemoved(params: any, dto: SingleBoolDto): Promise<import("./interfaces/user.interface").User>;
    requestPasswordReset(dto: SingleStringDto): Promise<void>;
}
