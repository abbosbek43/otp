import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateDto } from './dto/user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @Get()
    getUser () {
        return this.userService.getUsers()
    }

    @Put('update')
    updateUser(@Body() payload: UserUpdateDto) {
        return this.userService.updateUser(payload)
    }

    @Delete(':id')
    deleteUser (@Param('id') id: string) {
        return this.userService.deleteUser(parseInt(id))
    }
}
