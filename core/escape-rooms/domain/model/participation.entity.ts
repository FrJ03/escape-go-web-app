import { Participant } from '../../../users/domain/model/participant.entity';
import { EscapeRoom } from './escapeRoom.entity';

export class Participation {

    private _date: Date;
    private _points: number;
    private _sessionDuration: number;
    private _participant: Participant;
    private _escapeRoom: EscapeRoom;
    private _interval: number | undefined = undefined;

    constructor(participant: Participant, escapeRoom: EscapeRoom) {
        this._date = new Date();
        this._points = 0;
        this._sessionDuration = 0;
        this._participant = participant;
        this._escapeRoom = escapeRoom;
    }

    get date(): Date {
        return this._date;
    }

    get points(): number {
        return this._points;
    }

    get sessionDuration(): number {
        return this._sessionDuration;
    }

    get participant(): Participant {
        return this._participant;
    }

    get sscapeRoom(): EscapeRoom {
        return this._escapeRoom;
    }

    set date(date: Date){
        this._date = date;
    }

    set points(points: number){
        this._points = points;
    }

    set sessionDuration(sessionDuration: number){
        this._sessionDuration = sessionDuration;
    }

    set participant(participant: Participant){
        this._participant = participant;
    }

    set escapeRoom(escapeRoom: EscapeRoom){
        this._escapeRoom = escapeRoom;
    }

    public startSession(): void {
        this._interval = window.setInterval(() => {
            this._sessionDuration = Math.floor((Date.now() - this._date.getTime()) / 1000); // segundos
            
            if (this._sessionDuration >= this.escapeRoom.maxSessionDuration * 60) { // Convertir de minutos a segundos
                window.clearInterval(this._interval!);
                console.log("¡Tiempo límite alcanzado!");
            }
        }, 1000); // Actualización cada segundo
    }
}
