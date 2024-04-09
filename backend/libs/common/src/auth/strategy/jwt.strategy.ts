import { PrismaService } from "@app/common/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { jwtConstants } from "apps/api/src/auth/constant/auth.constant";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}