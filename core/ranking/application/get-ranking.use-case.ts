import { Users } from "../../users/domain/services/users.repository";
import { GetRankingResponse, ParticipantResponse } from "../dto/responses/get-ranking.response";

export class GetRankingUseCase {
    constructor(
        private readonly users: Users
    ) {}
    async with(): Promise<GetRankingResponse> {
        const ranking = await this.users.getRanking(10)

        const users: Array<ParticipantResponse> = []

        ranking.forEach(participant => {
            users.push({
                username: participant.username,
                points: participant.points
            })
        })
        
        return {
            code: 200,
            ranking: users
        }
    }
}