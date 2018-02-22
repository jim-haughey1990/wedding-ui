export class Message {
    message: string;
    description: string;
    category: string;

    constructor (m: string, d: string, c: string) {
        this.message = m;
        this.category = c;
        this.description = d;
    }
}