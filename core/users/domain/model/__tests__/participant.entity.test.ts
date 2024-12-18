import { Participant } from '../participant.entity';
import { Email } from '../value-objects/email';

describe('Participant class', () => {

    test('Inicializa el participant con los datos correctos y funcionamiento de gets y sets', () => {

        const email = new Email('participant@email.com');
        const new_email = new Email('participant2@email.com');
        const participante = new Participant(0, email, 'participant0', 'participant_password', 0);

        expect(participante.id).toBe(0);
        expect(typeof participante.email).toBe('object');
        expect(participante.email.value).toBe('participant@email.com');
        expect(participante.username).toBe('participant0');
        expect(participante.password).toBe('participant_password');
        expect(participante.points).toBe(0);

        participante.id = 1;
        participante.email = new_email;
        participante.username = 'participant1';
        participante.password = 'participant2_password';
        participante.points = 1;

        expect(participante.id).toBe(1);
        expect(typeof participante.email).toBe('object');
        expect(participante.email.value).toBe('participant2@email.com');
        expect(participante.username).toBe('participant1');
        expect(participante.password).toBe('participant2_password');
        expect(participante.points).toBe(1);

    });

});