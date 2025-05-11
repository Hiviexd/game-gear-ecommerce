import { Document, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

