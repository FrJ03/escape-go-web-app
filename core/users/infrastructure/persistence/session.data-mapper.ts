import { Session } from "../../domain/model/session.entity";
import { SessionType } from "./session.type";
import UserDataMapper from "./user.data-mapper";

const SessionDataMapper = {
    toModel: (session: SessionType): Session => (
        new Session(
            session.id, session.date,
            UserDataMapper.toModel(session.user)
        )
    ),
    toType: (session: Session): SessionType => ({
        id: session.id,
        date: session.date,
        user: UserDataMapper.toType(session.user)
    } as SessionType)
}

export { SessionDataMapper }