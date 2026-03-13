export class InsufficientFundsError extends Error {
    public readonly balance : number;
    public readonly price : number;

    constructor(balance: number, price: number) {
        super(`Fonds Insuffisants: Solde Total: $${balance}, prix: $${price}`);
        this.name = "InsufficientFundsError";
        this.balance = balance;
        this.price = price;
    }
}