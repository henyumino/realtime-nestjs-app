import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { RegisterUserDto } from './dto/register-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async login(authCredential): Promise<{ access_token: string }> {
    const email = await this.usersService.validateUser(authCredential);

    if (!email) {
      throw new UnauthorizedException('invalid credentials');
    }

    const accessToken = await this.jwtService.sign({ email });

    this.logger.debug(
      `Generate JWT Token with payload ${JSON.stringify({ email })}`,
    );

    return {
      access_token: accessToken,
    };
  }

  async register(authCredential: any): Promise<void> {
    return this.usersService.registerUser(authCredential);
  }
}
