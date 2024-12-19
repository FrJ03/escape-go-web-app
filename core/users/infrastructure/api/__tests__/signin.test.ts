import request from 'supertest';
import app from './../../../../app';
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client'
import bcrypt from 'bcrypt';

let postgres: Client;
describe('POST /signin', () => {
  beforeAll(async () => {
    postgres = new Client(PostgresSqlConfig);
    await postgres.connect();
    const password = 'passwordlogin';
    const hashedPassword = await bcrypt.hash(password, 10);
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['correouserlogin@gmail.com']);
    await postgres.query( 'INSERT INTO users (id, email, username, passwd, user_role, points) VALUES ($1, $2, $3, $4, $5, $6)',
    [998, 'correouserlogin@gmail.com', 'userlogin', hashedPassword, 'participant', 0]);
  });
  it('Debe devolver código 200 si las credenciales son correctas', async () => {
      const response = await request(app)
          .post('/account/signin')
          .send({ email: 'correouserlogin@gmail.com', password: 'passwordlogin' });

      expect(response.status).toBe(200);
  });

  test('Debe devolver código 400 si las credenciales son incorrectas', async () => {
      const response = await request(app)
          .post('/account/signin')
          .send({ password: 'wrongpass', email: 'wrong@mail.com' });

      expect(response.status).toBe(404);
  });
  afterAll(async () => {
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['correouserlogin@gmail.com']);
    await postgres.end();
  });
});