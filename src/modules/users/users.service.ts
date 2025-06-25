import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.models';
import { UserUpdateDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    async getUsers () {
        return this.userModel.findAll()
    }


    async updateUser(payload: UserUpdateDto) {
        const user = await this.userModel.findByPk(payload.id)
        if(!user) throw new NotFoundException('user not found !')
        await user.update(payload)
        return 'user successfully updated !'
    }


    async deleteUser (id) {
        const user = await this.userModel.destroy({where: {id}})
        if(!user) throw new NotFoundException('user not found !')
        return 'user successfully deleted'
    }
}
