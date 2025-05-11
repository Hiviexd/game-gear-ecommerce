import { IUser, IUserModel } from "../../interfaces/user.interface";
import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.index({ email: 1, username: 1 }, { unique: true });

userSchema.statics.findByEmail = async function (email: string): Promise<IUser | null> {
    return this.findOne({ email });
};

userSchema.statics.comparePassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, userPassword);
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
