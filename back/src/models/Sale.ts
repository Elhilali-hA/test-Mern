import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  SaleID: number;
  ProductID: number;
  Quantity: number;
  Date: Date;
  TotalAmount: number;
}

const saleSchema = new Schema<ISale>({
  SaleID: { type: Number, required: true },
  ProductID: { type: Number, required: true },
  Quantity: { type: Number, required: true },
  Date: { type: Date, required: true },
  TotalAmount: { type: Number, required: true }
});

saleSchema.index({ ProductID: 1 });
const Sale = mongoose.model<ISale>('Sale', saleSchema);

export default Sale;
