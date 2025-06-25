import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize'
import { User } from 'src/common/models/user.models';
import { LoginDto, RegisterDto, ResetPasswordDto, SendVerifyDto, TokenDto, VerificationDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { MailerService } from 'src/common/mailer/mailer.service';
import { Op } from 'sequelize';
import { RedisService } from 'src/common/redis/redis.service';


interface JwtPayload {
    id: number,
    role: string
}

@Injectable()
export class AuthService {
        constructor(@InjectModel(User) 
            private userModel: typeof User, 
            private jwtService: JwtService, 
            private readonly mailerService: MailerService,
            private readonly redisService: RedisService
        ) {}


    private async generateToken (payload: JwtPayload, AccsesTokenOnly = false) {
        const accessToken = await this.jwtService.signAsync(payload)
        if(AccsesTokenOnly) return {accessToken}

        const refreshToken = await this.jwtService.signAsync({id: payload.id})
        return { accessToken, refreshToken }
    }



    async register (payload: Required<RegisterDto>) {
        const user = await this.userModel.findOne({where: {[Op.or]: [{username: payload.username}, {email: payload.email}]}})
        if(user) throw new ConflictException('Invalid username or email')

        const code = Math.floor(100000 + Math.random() * 900000)
        this.mailerService.sendConfigurationMailer(payload.email, code)

        await this.redisService.set(`register: ${payload.email}`, JSON.stringify({...payload, code}), 600)
        
        return {message: `${payload.email}to send verification code !`}
    }

    async verification (payload: VerificationDto) {
        const data = await this.redisService.get(`register: ${payload.email}`)
        if(!data) throw new BadRequestException('OTp expire ')

        const user = JSON.parse(data)
        if(user.code != payload.code) throw new BadRequestException('Otp Invalide !')

        await this.redisService.del(`register: ${payload.email}`)
        delete user.code

        const hash = await bcrypt.hash(user.password, 10)
        const res = await this.userModel.create({...user, password: hash})

        return this.generateToken({id:res.dataValues.id, role: res.dataValues.role}, false)
    }


    async login (payload: Required<LoginDto>) {
        const user = await this.userModel.findOne({where: {username: payload.username}})
        if(!user || !(await bcrypt.compare(payload.password, user.dataValues.password))) {
            throw new ConflictException('Invalid username or password')
        }

        return this.generateToken({id:user.dataValues.id, role: user.dataValues.role}, false)
    }



    async refreshToken ({token}: Required<TokenDto>) {
        try {
            const data = await this.jwtService.verifyAsync(token)
            const user = await this.userModel.findByPk(data.id)

            return this.generateToken({id: user?.dataValues.id, role: user?.dataValues.role}, true)
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token')
        }
    }


    async sendverify(payload: SendVerifyDto) {
        const code = Math.floor(100000 + Math.random() * 900000)

        await this.mailerService.sendConfigurationMailer(payload.email, code)
        await this.redisService.set(`pass: ${payload.email}`, JSON.stringify({...payload,code}), 600)

        return {message:  `${payload.email}to send verification code !`}
    }


    async resetPassword (payload: ResetPasswordDto) {
        const stored = await this.redisService.get(`pass: ${payload.email}`)
        if(!stored) throw new BadRequestException('Otp expire or invalid !')
        
        const user = JSON.parse(stored)
        if(user.code != payload.code) throw new BadRequestException('Otp invalide !!')

        await this.redisService.del(`pass: ${payload.email}`)
        console.log(payload)
        const hash = await bcrypt.hash(payload.password, 10)
        await this.userModel.update({password: hash}, {where: {email: payload.email}})

        return {message: 'Password succes updated'}
        
    }


}
