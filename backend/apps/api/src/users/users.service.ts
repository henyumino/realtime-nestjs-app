import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private logger = new Logger('UserService');

  async validateUser(userCredentials: any): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userCredentials.email,
      },
    });

    // if user found and password salt is match with password then return user email
    if (
      user &&
      (await this.validatePassword(
        user.password,
        user.salt,
        userCredentials.password,
      ))
    ) {
      return user.email;
    } else {
      return null;
    }
  }

  async validatePassword(
    password: string,
    salt: string,
    credentialsPassword: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(credentialsPassword, salt);
    return hash === password;
  }

  async registerUser(userCredentials: any): Promise<void> {
    const { email, password, fullname } = userCredentials;

    const getUserWithSameEmail = await this.prisma.user.count({
      where: {
        email: email,
      },
    });

    if (getUserWithSameEmail != 0) {
      throw new ConflictException('email already exist');
    }

    const userSalt = await bcrypt.genSalt();
    const user = {
      email: email,
      fullname: fullname,
      salt: userSalt,
      password: await bcrypt.hash(password, userSalt),
    };

    this.logger.debug(user)

    try {
      await this.prisma.user.create({
        data: user,
      });
      this.logger.debug('user created');
    } catch (error) {
      this.logger.debug(error);
      throw new InternalServerErrorException();
    }
  }
}

