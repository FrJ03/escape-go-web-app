export class Email{

    private _value: string

    constructor(private mail: string){
        this._value = mail
    }
    public static create(mail: string): Email | undefined{
        if(this.esMail(mail)){ //si es true es un mail
            return new Email(mail)
        }
        else{
            return undefined
        }
    }

   public static esMail(posiblemail: string): boolean {
    
        const patronEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //indica el patron de un mail

        return patronEmail.test(posiblemail); //devuelve true o false si lo cumple

   }

   get value(): string{
        return this._value;
   }

   set value(newmail: string){
        if(Email.esMail(newmail)){

            this._value= newmail;
        }
   }

}