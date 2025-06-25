import { Column, Model, Table, DataType } from 'sequelize-typescript'
import { UserRole } from 'src/global/type/user'

@Table({tableName: 'users'})
export class User extends Model {

    @Column
    username: string

    @Column
    password: string

    @Column
    email: string

    @Column({type: DataType.ENUM(...Object.values(UserRole)), defaultValue: UserRole.USER})
    role: UserRole

}