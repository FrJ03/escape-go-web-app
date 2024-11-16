import { email } from './value-objects/email';

export class user{

    private e_mail: email | undefined;

    private username: string;

    private password: string;

    constructor(e_mail: string, username: string, password: string){ //constructor parametrizado

        this.setEmail(e_mail);

        this.username = username;

        this.password = password;

    }
    
    public getEmail(): email | undefined{

        return this.e_mail;

    }

    public getUsername(): string{

        return this.username;

    }

    public getPassword(): string{

        return this.password;

    }

    public setEmail(e_mail: string): void{ //recibe un string se crea el objeto e_mail y se realiza el set

        this.e_mail = new email(e_mail); //devuelve un mail o cadena vacia (mail vacio) dependiendo de si el string tiene formato mail

    }

    public setUsername(username: string): void{

        this.username = username;

    }

    public setPassword(password: string): void{

        this.password = password;

    }

}