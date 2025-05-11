import { IUserClient } from "./user-client.interface";
import { IItemClient } from "./item-client.interface";

export interface IOrderClient {
    _id: string;
    user: IUserClient;
    items: { item: IItemClient; quantity: number }[];
    totalPrice: number;
    createdAt?: string;
    updatedAt?: string;
}
