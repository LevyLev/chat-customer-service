import { Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
  role: 'admin' | 'representative' | 'guest';
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export const User = model<IUser>('User', userSchema);
