import { Document, Model } from "mongoose";
import { IUser } from "./user.interface";

export type ItemStatus = "available" | "sold";
export type ItemType = "game" | "console" | "accessory";

export interface IItem extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    seller: IUser;
    status: ItemStatus;
    type: ItemType;
    maxQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IItemModel extends Model<IItem> {
    findBySlug(slug: string): Promise<IItem | null>;
}
