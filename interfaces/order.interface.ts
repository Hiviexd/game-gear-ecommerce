import { Document, Model } from "mongoose";
import { IUser } from "./user.interface";
import { IItem } from "./item.interface";

export type OrderItem = {
    item: IItem;
    quantity: number;
};

export interface IOrder extends Document {
    user: IUser;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;

    // virtual fields
    totalPrice: number;
}

export interface IOrderModel extends Model<IOrder> {
    getOrdersByUser(user: IUser): Promise<IOrder[]>;
}
