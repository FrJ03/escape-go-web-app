import { DeleteUserUseCase } from "../delete-user.use-case";
import { DeleteRequest } from "../../dto/requests/delete.request";
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import { User } from "../../domain/model/user.entity";

describe('DeleteUserUseCase', () => {

    test('Recibir DeleteRequest correctamente y obtener DeleteResponse válida', () => {

        const request: DeleteRequest = {

            email: 'notrealmail@mail.com',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const deleteusercase = new DeleteUserUseCase(users);

        deleteusercase.with(request).then((response) => {

            expect(response.code).toBe(200);

        });

    });

    test('Recibir DeleteRequest no valido y comprobar DeleteResponse ', () => {

        const request: DeleteRequest = {

            email: 'notrealmail@mail.com@notrealmail',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const deleteusercase = new DeleteUserUseCase(users);

        deleteusercase.with(request).then((response) => {

            expect(response.code).toBe(404);

        });

    });

})