import { Email } from './value-objects/email';

export class User{

    private _id: number

    private _email: Email;

    private _username: string;

    private _password: string;

    constructor(id: number, e_mail: Email, username: string, password: string){ //constructor parametrizado
        this._id = id
        this._email = e_mail
        this._username = username;
        this._password = password;

    }

    get id(): number{
        return this._id
    }
    
    get email(): Email{
        return this._email;
    }

    get username(): string{
        return this._username;
    }

    get password(): string{
        return this._password;
    }

    set id(id: number){
        this._id = id
    }

    set email(email: Email){ //recibe un string se crea el objeto e_mail y se realiza el set
        this._email = email; //devuelve un mail o cadena vacia (mail vacio) dependiendo de si el string tiene formato mail
    }

    set username(username: string){
        this._username = username;
    }

    set password(password: string){
        this._password = password;
    }

}