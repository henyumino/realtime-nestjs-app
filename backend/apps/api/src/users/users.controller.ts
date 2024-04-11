import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';
import { GetUser } from './decorator/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() req) {
    return req;
  }

}
