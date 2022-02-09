import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL || 'postgresql:///test_observation',
      ssl: process.env.DATABASE_URL ? {
        rejectUnauthorized: false // Heroku uses self-signed certs
      } : false, // This is a bit messy; I want SSL for Heroku and not locally 
      migrations: ["dist/migration/*.js"],
      migrationsRun: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
