import { model, Schema } from "mongoose";
import { IOrder, IOrderModel, OrderItem } from "../../interfaces/order.interface";
import { IUser } from "../../interfaces/user.interface";

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
                quantity: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("totalPrice").get(function (this: IOrder) {
    return this.items.reduce((total, item) => total + item.quantity * item.item.price, 0);
});

orderSchema.statics.getOrdersByUser = async function (user: IUser): Promise<IOrder[]> {
    const orders = await this.find({ user });
    return orders;
};

const Order = model<IOrder, IOrderModel>("Order", orderSchema);

export default Order;
