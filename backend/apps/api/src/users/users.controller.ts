import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { GetUser } from './decorator/get-user.decorator';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() req) {
    return req;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const user = await this.userService.findUserById(data);
    delete user.salt;
    delete user.password;
    return user;
  }
}
