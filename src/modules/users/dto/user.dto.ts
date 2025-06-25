import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, MaxLength, IsNumber, IsNotEmpty } from "class-validator";

export class UserUpdateDto {

    @ApiProperty({default: 1})
    @IsNumber()
    @IsNotEmpty()
    id: number

    @ApiProperty({default: "Muhammadrizo"})
    @IsString()
    username?: string

    @ApiProperty({default: "m701rizo@gmail.com"})
    @IsEmail()
    email?: string

    @ApiProperty({default: "12345678"})
    @MinLength(6)
    @MaxLength(22)
    @IsString()
    password?: string
}