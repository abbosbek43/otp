import { IsNotEmpty, IsString, IsEmail, IsJWT, MinLength, MaxLength, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';


export class RegisterDto {
    
    @ApiProperty({default: 'Muhammadrizo'})
    @IsString()
    @IsNotEmpty()
    username: string
    
    @ApiProperty({default: '12345678', type: String})
    @IsString()
    @MinLength(6)
    @MaxLength(22)
    @IsNotEmpty()
    password: string

    @ApiProperty({default: 'm701rizo@gmail.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string
}


export class LoginDto {


    @ApiProperty({default: 'Muhammadrizo'})
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty({default: '12345678', type: String})
    @IsString()
    @MinLength(6)
    @MaxLength(22)
    @IsNotEmpty()
    password: string
}


export class TokenDto {

    @ApiProperty()
    @IsJWT()
    @IsNotEmpty()
    token: string
}



export class VerificationDto {

    @IsEmail()
    email: string

    @IsNumber()
    code: number
}


export class SendVerifyDto {
    @IsEmail()
    email: string
}


export class ResetPasswordDto extends VerificationDto {
    @IsString()
    @MinLength(6)
    @MaxLength(22)
    @IsNotEmpty()
    password: string
}