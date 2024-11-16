export class EscapeRoom {

    private _id: number;
    private _title: string;
    private _description: string;
    private _solution: string;
    private _difficulty: number;
    private _price: number;
    private _maxSessionDuration: number;

    constructor(id: number, title: string, description: string, solution: string, difficulty: number, price: number, maxSessionDuration: number) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._solution = solution;
        this._difficulty = difficulty;
        this._price = price;
        this._maxSessionDuration = maxSessionDuration;
    }

    getId(): number {
        return this._id;
    }

    getTitle(): string {
        return this._title;
    }

    getDescription(): string {
        return this._description;
    }

    getSolution(): string {
        return this._solution;
    }

    getDifficulty(): number {
        return this._difficulty;
    }

    getPrice(): number {
        return this._price;
    }

    getMaxSessionDuration(): number {
        return this._maxSessionDuration;
    }

    setId(id: number): void {
        this._id = id;
    }

    setTitle(title: string): void {
        this._title = title;
    }

    setDescription(description: string): void {
        this._description = description;
    }

    setSolution(solution: string): void {
        this._solution = solution;
    }

    setDifficulty(difficulty: number): void {
        this._difficulty = difficulty;
    }

    setPrice(price: number): void {
        this._price = price;
    }

    setMaxSessionDuration(maxSessionDuration: number): void {
        this._maxSessionDuration = maxSessionDuration;
    }
}
