import { IUserClient } from "./user-client.interface";
import { ItemStatus, ItemType } from "../../../interfaces/item.interface";

export interface IItemClient {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    seller: IUserClient;
    status: ItemStatus;
    type: ItemType;
    maxQuantity: number;
    createdAt?: string;
    updatedAt?: string;
}
