import { Email } from './value-objects/email';

export class User{

    private id: number

    private e_mail: Email;

    private username: string;

    private password: string;

    constructor(id: number, e_mail: Email, username: string, password: string){ //constructor parametrizado
        this.id = id
        this.e_mail = e_mail

        this.username = username;

        this.password = password;

    }
    
    public getEmail(): Email | undefined{

        return this.e_mail;

    }

    public getUsername(): string{

        return this.username;

    }

    public getPassword(): string{

        return this.password;

    }

    public setEmail(e_mail: string): void{ //recibe un string se crea el objeto e_mail y se realiza el set

        this.e_mail = new Email(e_mail); //devuelve un mail o cadena vacia (mail vacio) dependiendo de si el string tiene formato mail

    }

    public setUsername(username: string): void{

        this.username = username;

    }

    public setPassword(password: string): void{

        this.password = password;

    }

}