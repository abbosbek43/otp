import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.models';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccsesToken } from 'src/common/jwt/jwt-auth';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),  JwtModule.register(JwtAccsesToken), MailerModule, RedisModule ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
