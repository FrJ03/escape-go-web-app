import { describe, test } from "@jest/globals";
import { Participant } from "../participant.entity";
import { Email } from "../value-objects/email";
import { Session } from "../session.entity";

describe('Session test', () => {
    test('Test constructor', () => {
        const user = new Participant(
            1,
            new Email('test@test.es'),
            'test',
            'test'
        )

        const new_session: Session = new Session(1, new Date(Date.now()), user)

        expect(new_session).toBeDefined()
        expect(new_session instanceof Session).toBeTruthy()
        expect(new_session.user.email.value).toBe(user.email.value)
    })
})