import { NotFoundError } from "../../../commons/domain/errors/not-found.error";
import { Users } from "../../domain/services/users.repository";
import { UserPublisher } from "../persistence/user.publisher";
import { User } from "../../domain/model/user.entity"
import { Client } from "pg"

export class UsersSql implements Users {
    private publisher: UserPublisher

    constructor(private readonly postgres: Client){
        this.publisher = new UserPublisher(postgres)
    }

    async save(user: User): Promise<void>{
        return this.publisher.create(user)
    }
}