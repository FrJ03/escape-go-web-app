import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import { container } from "../../../commons/container/container";
import { Client } from "pg";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client";
import { Participant } from "../../../users/domain/model/participant.entity";
import * as bcrypt from 'bcrypt';
import { Email } from "../../../users/domain/model/value-objects/email";
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository";
import { SALT } from "../../../commons/utils/config";

describe('UpdateProfileUseCase tests', () => {
  let postgres: Client;
  postgres = new Client(PostgresSqlClient);

  const user = {
    email: 'user@gmail.com',
    username: 'test',
    password: 'test'
  };

  beforeAll(async () => {
    await postgres.connect();
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users');

    const password_cipher = await bcrypt.hash(user.password, SALT);
    const new_user = new Participant(1, new Email(user.email), user.username, password_cipher);

    const users = new UsersSql(PostgresSqlClient);
    await users.save(new_user);
  });

  afterAll(async () => {
    await postgres.query('DELETE FROM userssessions');
    await postgres.query('DELETE FROM users');
    await postgres.end();
  });

  test('Debe actualizar el perfil con el nuevo email, username y password', async () => {
    const request = {
      emailOriginal: user.email,
      emailNuevo: 'new@gmail.com',
      username: 'newUsername',
      password: 'newPassword'
    };

    const response = await container.updateProfile.with(request);
    expect(response.code).toBe(200);
  });

  test('Debe actualizar el perfil con al menos un parámetro', async () => {
    const request = {
      emailOriginal: 'new@gmail.com',
      username: 'new2Username',
    };

    const response = await container.updateProfile.with(request);
    expect(response.code).toBe(200);
  });


  test('Debe devolver 404 si no encuentra el usuario', async () => {
    const request = {
      emailOriginal: 'no_existe@gmail.com',
      emailNuevo: 'newEmail@gmail.com',
    };

    const response = await container.updateProfile.with(request);
    expect(response.code).toBe(404);
  });

});
