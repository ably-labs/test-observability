import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/uploads')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  root(): void {}
}
