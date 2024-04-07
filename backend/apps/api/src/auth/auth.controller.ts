import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger('Auth Controller')

  // TODO test fitur auth, jika ada yang kurang tambahkan

  @Post('login')
  async login(@Body() req): Promise<{ access_token: string }> {
    return this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req): Promise<void> {
    return this.authService.register(req);
  }
}
