import { Participant } from './participant.entity';
import { EscapeRoom } from './escapeRoom.entity';

export class Participation {

    private _date: Date;
    private _points: number;
    private _sessionDuration: number;
    private _participant: Participant;
    private _escapeRoom: EscapeRoom;
    private _interval: number | null = null;

    constructor(participant: Participant, escapeRoom: EscapeRoom) {
        this._date = new Date();
        this._points = 0;
        this._sessionDuration = 0;
        this._participant = participant;
        this._escapeRoom = escapeRoom;
    }

    getDate(): Date {
        return this._date;
    }

    getPoints(): number {
        return this._points;
    }

    getSessionDuration(): number {
        return this._sessionDuration;
    }

    getMaxSessionDuration(): number {
        return this._escapeRoom.getMaxSessionDuration();
    }

    getParticipant(): Participant {
        return this._participant;
    }

    getEscapeRoom(): EscapeRoom {
        return this._escapeRoom;
    }

    setDate(date: Date): void {
        this._date = date;
    }

    setPoints(points: number): void {
        this._points = points;
    }

    setSessionDuration(sessionDuration: number): void {
        this._sessionDuration = sessionDuration;
    }

    setParticipant(participant: Participant): void {
        this._participant = participant;
    }

    setEscapeRoom(escapeRoom: EscapeRoom): void {
        this._escapeRoom = escapeRoom;
    }

    public startSession(): void {
        this._interval = window.setInterval(() => {
            this._sessionDuration = Math.floor((Date.now() - this._date.getTime()) / 1000); // segundos
            
            if (this._sessionDuration >= this.getMaxSessionDuration() * 60) { // Convertir de minutos a segundos
                window.clearInterval(this._interval!);
                console.log("¡Tiempo límite alcanzado!");
            }
        }, 1000); // Actualización cada segundo
    }
}
