import { IItem, IItemModel } from "../../interfaces/item.interface";
import { model, Schema } from "mongoose";
import slugify from "slugify";
const itemSchema = new Schema<IItem, IItemModel>(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["available", "sold"], default: "available" },
        type: { type: String, enum: ["game", "console", "accessory"], required: true },
        maxQuantity: { type: Number, required: true, default: 1 },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

itemSchema.index({ slug: 1 }, { unique: true });

// generate slug from name
itemSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        // Generate base slug from title
        const baseSlug = slugify(this.name, { lower: true, strict: true });

        // Check if slug exists
        let slug = baseSlug;
        let counter = 1;

        while (await Item.exists({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

itemSchema.statics.findBySlug = async function (slug: string): Promise<IItem | null> {
    const item = await this.findOne({ slug });
    return item;
};

const Item = model<IItem, IItemModel>("Item", itemSchema);

export default Item;
