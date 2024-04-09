import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtConstants } from "apps/api/src/auth/constant/auth.constant";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
    PrismaModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}