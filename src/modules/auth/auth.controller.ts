import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResetPasswordDto, SendVerifyDto, TokenDto, VerificationDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}


    @Post('register')
    register(@Body() payload: RegisterDto) {
        return this.authService.register(payload)
    }

    @Post('verification')
    verification(@Body() payload: VerificationDto) {
        return this.authService.verification(payload)
    }


    @Post('login')
    login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }


    @Post('refresh-token')
    refreshToken(@Body() token:TokenDto) {
        return this.authService.refreshToken(token)
    }

    @Post('send-verify')
    sendverify(@Body() payload: SendVerifyDto) {
        return this.authService.sendverify(payload)
    }

    @Put(`reset-password`)
    resetPassword(@Body() payload: ResetPasswordDto) {
        return this.authService.resetPassword(payload)
    }
}
