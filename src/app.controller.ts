import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Permissions([{ resource: Resource.settings, actions: [Action.read] }])
  @Get()
  someProtectedRoute(@Req() req) {
    return { message: 'Accessed Resource', userId: req.userId };
  }
}
