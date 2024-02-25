import { Schema, model, Document } from 'mongoose';

export interface ICustomerServiceRep extends Document {
  name: string;
  available: boolean;
}

const customerServiceRep = new Schema<ICustomerServiceRep>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

export const CustomerService = model<ICustomerServiceRep>(
  'CustomerService',
  customerServiceRep
);
