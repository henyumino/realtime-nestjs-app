import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );

  await app.listen(5000);
}
bootstrap();


/* 
  TODO:
  - coba untuk pecah auth service ke standalone service supaya chat service bisa akses user dengan mengirimkan access token
  - atau coba menggunakan rabbitmq request user dari chat -> api gateway untuk mendapatkan user berdasarkan access token
*/
