import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
}

const productSchema = new Schema<IProduct>({
  ProductID: { type: Number, required: true },
  ProductName: { type: String, required: true },
  Category: { type: String, required: true },
  Price: { type: Number, required: true }
});

productSchema.index({ ProductID: 1 });


const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
