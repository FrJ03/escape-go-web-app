import { Admin } from '../admin.entity';
import { Email } from '../value-objects/email';

describe('Admin class', () => {

    test('Inicializa el admin con los datos correctos y funcionamiento de gets y sets', () => {

        const email = new Email('admin@mail.com');
        const new_email = new Email('admin2@mail.com');
        const administrador = new Admin(0, email, 'admin', 'admin_password');

        expect(administrador.id).toBe(0);
        expect(typeof administrador.email).toBe('object');
        expect(administrador.email.value).toBe('admin@mail.com');
        expect(administrador.username).toBe('admin');
        expect(administrador.password).toBe('admin_password');

        administrador.id = 1;
        administrador.email = new_email;
        administrador.username = 'admin2';
        administrador.password = 'admin2_password';

        expect(administrador.id).toBe(1);
        expect(typeof administrador.email).toBe('object');
        expect(administrador.email.value).toBe('admin2@mail.com');
        expect(administrador.username).toBe('admin2');
        expect(administrador.password).toBe('admin2_password');


    });

});