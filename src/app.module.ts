import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config';

dotenv.config(); // Ensure dotenv is loaded

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 20,
      blockDuration: 10 * 60000
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'))
        return connection
      }
    }),
    UserModule,
    AuthModule,
    S3Module,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
