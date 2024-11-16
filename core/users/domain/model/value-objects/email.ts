export class Email{

    private value: string

    constructor(private mail: string){
        this.value = mail
    }
    public static create(mail: string): Email | null{
        if(this.esMail(mail)){ //si es true es un mail
            return new Email(mail)
        }
        else{
            return null
        }
    }

   private static esMail(posiblemail: string): boolean {
    
        const patronEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //indica el patron de un mail

        return patronEmail.test(posiblemail); //devuelve true o false si lo cumple

   }

   public getMail(): string{
        return this.value;
   }

   public setMail(newmail: string){

        if(Email.esMail(newmail)){

            this.value= newmail;
        }
        else{

            this.value = "";

        }

   }

}