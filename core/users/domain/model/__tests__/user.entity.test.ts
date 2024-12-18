import { User } from '../user.entity';
import { Email } from '../value-objects/email'

describe('User class', () => {

    test('Inicializa el usuario con los datos correctos y funcionamiento de gets y sets', () => {

        const email = new Email('user@username.com');
        const new_email = new Email('newemail@email.com');
        const usuario = new User(0, email, 'username', 'password');

        expect(usuario.id).toBe(0); //number
        expect(typeof usuario.email).toBe('object'); //tipo objeto porque se devuelve el objeto tipo Email, si se le ejecuta value debe dar la cadena string que forma el email
        expect(usuario.email.value).toBe('user@username.com'); //cadena de email
        expect(usuario.username).toBe('username'); //string
        expect(usuario.password).toBe('password'); //string

        usuario.id = 1;
        usuario.email = new_email;
        usuario.username = 'newusername';
        usuario.password = 'newpassword';

        expect(usuario.id).toBe(1); //number
        expect(typeof usuario.email).toBe('object'); //tipo objeto porque se devuelve el objeto tipo Email, si se le ejecuta value debe dar la cadena string que forma el email
        expect(usuario.email.value).toBe('newemail@email.com'); //cadena de email
        expect(usuario.username).toBe('newusername'); //string
        expect(usuario.password).toBe('newpassword'); //string
    
    });

});

