import request from 'supertest';
import app from './../../../../app';
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client'

describe('POST /signup', () => {
  let postgres: Client;

  beforeAll(async () => {
    postgres = new Client(PostgresSqlConfig);
    await postgres.connect();
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['testusersignup@gmail.com']);
  });

  afterAll(async () => {
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['testusersignup@gmail.com']);
    await postgres.end();
  });

  it('Debe devolver código 200 si los datos son correctos y crea un usuario', async () => {
    const response = await request(app)
      .post('/account/signup')
      .send({
        username: 'testusersignup',
        password: 'password',
        email: 'testusersignup@gmail.com',
      });

    expect(response.status).toBe(200);

    
  });

  it('Debe devolver error 400 si el email es inválido', async () => {
    const response = await request(app)
      .post('/account/signup')
      .send({
        username: 'testuser',
        password: 'password',
        email: 'incorrecto_gmail',
      });

    expect(response.status).toBe(400);
  });

  it('Debe devolver error 400 si falta algún campo', async () => {
    const response = await request(app)
      .post('/account/signup')
      .send({
        // Falta la contraseña
        username: 'testuser',
        email: 'testuser@gmail.com',
      });

    expect(response.status).toBe(400);
  });
});
