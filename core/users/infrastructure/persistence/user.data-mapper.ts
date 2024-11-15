import { UserType } from "./user.type";
import {Admin} from '../../domain/model/admin.entity.ts'
import {Participant} from '../../domain/model/participant.entity.ts'
import { Email } from '../../domain/model/value-objects/email'
import { User } from '../../domain/model/user.entity'


/**
 * Class used to transform database information about the user to domain user or in the opposite direction
 */
const UserDataMapper = {
    toModel: (user: UserType): User => {
        if(user.role === "admin"){
            return Admin(
                user.id,
                new Email(user.email),
                user.username,
                user.password,
            )
        }
        else{
            return Participant(
                user.id,
                new Email(user.email),
                user.username,
                user.password,
                user.points
            )
        }
    },
    toType: (user: User): UserType => ({
        id: user.id,
        email: user.email.value,
        username: user.email.value,
        password: user.password,
        role: (user instanceof Admin) ? 'admin' : 'participant',
        points: (user instanceof Admin) ? -1 : user.points,
    })
}

export default UserDataMapper