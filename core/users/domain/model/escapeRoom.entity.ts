export class EscapeRoom {

    private id: number;
    private title: string;
    private description: string;
    private solution: string;
    private difficulty: number;
    private price: number;
    private maxSessionDuration: number;

    constructor(id: number, title: string, description: string, solution: string, difficulty: number, price: number, maxSessionDuration: number) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.solution = solution;
        this.difficulty = difficulty;
        this.price = price;
        this.maxSessionDuration = maxSessionDuration;
    }

    getId(): number {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getSolution(): string {
        return this.solution;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    getPrice(): number {
        return this.price;
    }

    getMaxSessionDuration(): number {
        return this.maxSessionDuration;
    }

    setId(id: number): void {
        this.id = id;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setSolution(solution: string): void {
        this.solution = solution;
    }

    setDifficulty(difficulty: number): void {
        this.difficulty = difficulty;
    }

    setPrice(price: number): void {
        this.price = price;
    }

    setMaxSessionDuration(maxSessionDuration: number): void {
        this.maxSessionDuration = maxSessionDuration;
    }
}
