import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SingleStringDto } from '../dto/single-string.dto';
import { IsUserGuard } from './guards/is-user.guard';
import { AuthorizedRequest } from './interfaces/authorized-request.interface';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SingleBoolDto } from '../dto/single-bool.dto';
import { IsAdminGuard } from './guards/is-admin.guard';

@Controller('users')
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Post()
  async createUser(
    @Body(ValidationPipe) dto: CreateUserDto
  ) {
    return this.usersService.createUser(dto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) dto: SignInDto
  ) {
    return this.usersService.signIn(dto);
  }

  @UseGuards(IsUserGuard)
  @Post('/signout')
  async signOut(
    @Req() req: AuthorizedRequest,
  ) {
    return this.usersService.signOut(req.user, req.token);
  }

  @UseGuards(IsUserGuard)
  @Get('/me')
  async me(
    @Req() req: AuthorizedRequest
  ) {
    return req.user;
  }

  @UseGuards(IsUserGuard)
  @Post('/update-password')
  async updatePassword(
    @Req() req: AuthorizedRequest,
    @Body(ValidationPipe) dto: UpdatePasswordDto
  ) {
    return this.usersService.updateUserPassword(req.user, dto);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body(ValidationPipe) dto: ResetPasswordDto
  ) {
    return this.usersService.resetUserPassword(dto);
  }

  @Get()
  async getAll(
    @Req() req
  ) {
    if (req.user && req.user.admin) {
      return this.usersService.getAllUsers(false);
    } else {
      return this.usersService.getAllUsers(true);
    }
  }

  @Get('/by-id/:id')
  async getUserById(
    @Param() params
  ) {
    return this.usersService.getUserById(params.id);
  }

  @UseGuards(IsAdminGuard)
  @Patch('/admin/:id')
  async setAdmin(
    @Param() params,
    @Body(ValidationPipe) dto: SingleBoolDto
  ) {
    return this.usersService.setAdmin(params.id, dto.value);
  }

  @UseGuards(IsUserGuard)
  @Patch('/email')
  async setEmail(
    @Req() req: AuthorizedRequest,
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.usersService.setEmail(req.user, dto.value);
  }

  @UseGuards(IsUserGuard)
  @Patch('/bio')
  async setBio(
    @Req() req: AuthorizedRequest,
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.usersService.setBio(req.user, dto.value);
  }

  @UseGuards(IsAdminGuard)
  @Patch('/removed/:id')
  async setRemoved(
    @Param() params,
    @Body(ValidationPipe) dto: SingleBoolDto
  ) {
    return this.usersService.setRemoved(params.id, dto.value);
  }

  @Post('/request-reset-password')
  async requestPasswordReset(
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.usersService.requestPasswordReset(dto.value);
  }
}
