import { Email } from '../domain/model/value-objects/email';


describe('Email Class', () => {
  test('Debe crear, obtener y establecer el valor correctamente de un Email', () => {

    // Test de creación con un email válido
    const emailValido = Email.create('valid@example.com');
    expect(emailValido).toBeDefined();
    expect(emailValido?.value).toBe('valid@example.com');

    // Test de creación con un email inválido
    const emailInvalido = Email.create('invalid-email');
    expect(emailInvalido).toBeUndefined();

    // Test del getter
    const email = Email.create('valid@example.com');
    expect(email?.value).toBe('valid@example.com');

    // Test del setter
    email!.value = 'newemail@example.com';
    expect(email?.value).toBe('newemail@example.com');

    email!.value = 'invalid-email';
    expect(email?.value).toBe('newemail@example.com');
    email!.value = 'invalid-email@';
    expect(email?.value).toBe('newemail@example.com');
  });
});
