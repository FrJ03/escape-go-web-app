import request from 'supertest';
import app from './../../../../app';
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client'
import bcrypt from 'bcrypt';

let postgres: Client;

describe('DELETE /', () => {
  beforeAll(async () => {
    postgres = new Client(PostgresSqlConfig);
    await postgres.connect();
    const password = 'passworddelete';
    const hashedPassword = await bcrypt.hash(password, 10);
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['correouserdelete@gmail.com']);
    await postgres.query( 'INSERT INTO users (id, email, username, passwd, user_role, points) VALUES ($1, $2, $3, $4, $5, $6)',
    [997, 'correouserdelete@gmail.com', 'userdelete', hashedPassword, 'participant', 0]);
  });
  
  afterAll(async () => {
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users WHERE email = $1', ['correouserdelete@gmail.com']);
    await postgres.end();
  });
  test('Debe devolver código 200 si el usuario se ha borrado correctamente', async () => {
    const Response = await request(app)
      .delete('/account')
      .send({ email: 'correouserdelete@gmail.com', password: 'passworddelete' });

    expect(Response.status).toBe(200);
  });

  test('Debe devolver código 400 si no se ha borrado correctamente', async () => {
    const response = await request(app)
      .delete('/account')
      .send({
        email: 'noexistente@gmail.com', password: 'password' });

    expect(response.status).toBe(400);
  });
});
