import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger('Auth Controller')

  @Post('login')
  async login(@Body() req: AuthLoginDto): Promise<{ access_token: string }> {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req: AuthRegisterDto): Promise<void> {
    return this.authService.register(req);
  }
}
