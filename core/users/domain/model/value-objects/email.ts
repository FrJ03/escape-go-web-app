export class Email{

    private mail: string

    constructor(mail: string){

        if(this.esMail(mail)){ //si es true es un mail

            this.mail = mail;

        }
        else{

            this.mail = "";

        }

    }

   private esMail(posiblemail: string): boolean {
    
        const patronEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //indica el patron de un mail

        return patronEmail.test(posiblemail); //devuelve true o false si lo cumple

   }

   public getMail(): string{

    return this.mail;

   }

   public setMail(newmail: string){

    if(this.esMail(newmail)){

        this.mail= newmail;

    }
    else{

        this.mail = "";

    }

   }

}