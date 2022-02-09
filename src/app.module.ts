import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL || 'postgresql:///test_observation',
      migrations: ["dist/migration/*.js"],
      migrationsRun: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
