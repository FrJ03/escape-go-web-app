import { NotFoundError } from "../../../commons/domain/errors/not-found.error";
import { Users } from "../../domain/services/users.repository";
import { UserPublisher } from "../persistence/user.publisher";
import { User } from "../../domain/model/user.entity"
import { ClientConfig, Client } from 'pg'
import { UserType } from "../persistence/user.type";
import UserDataMapper from "../persistence/user.data-mapper";

export class UsersSql implements Users {
    private publisher: UserPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this.publisher = new UserPublisher(postgres_config)
    }

    async save(user: User): Promise<boolean>{
        if(await this.findUser(user.email.value) != undefined){
            return false
        }
        else{
            return await this.publisher.create(user)
        }   
    }
    async findUser(email: string): Promise<User | undefined>{
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query('SELECT * FROM users WHERE email = $1', [email])
        await postgres.end()
        if(response.rowCount != 0){
            const data = {
                id: response.rows[0].id,
                email: response.rows[0].email,
                password: response.rows[0].passwd,
                role: response.rows[0].user_role,
                points: response.rows[0].points
            } as UserType

            return UserDataMapper.toModel(data)
        }
        else{
            return undefined
        }
    }
}