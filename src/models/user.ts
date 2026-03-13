import {Order} from './order.js'

export class User {
    public id : number;
    public name : string;
    public wallet : string;
    public orders : Order[];

    constructor(id: number, name: string, wallet: string, orders: Order[]) {
        this.id = id;
        this.name = name;
        this.wallet = wallet;
        this.orders = orders;
    }
}