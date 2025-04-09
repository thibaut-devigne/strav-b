import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'password',
      database: 'strav-b',
      autoLoadEntities: true,
      synchronize: true, // À désactiver en production
    }),
    AuthModule,
    UsersModule,
    ActivityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
