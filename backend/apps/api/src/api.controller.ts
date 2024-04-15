import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiController {
  constructor(
    private readonly apiService: ApiService
  ) {}

  @Get()
  getHello(): string {
    return this.apiService.getHello();
  }

}
