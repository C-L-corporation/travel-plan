import { Schema, model } from 'mongoose';

type IUser = {
  name: string;
  email?: string;
  photo?: string;
  providers: ReadonlyArray<{ provider: string; userId: string }>;
  isAdmin: boolean;
  planTriggers: ReadonlyArray<Date>;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String },
  providers: { type: [{ provider: String, userId: String }], default: [] },
  isAdmin: { type: Boolean, default: false },
  planTriggers: {
    type: [Date],
    default: [],
  },
});

const User = model<IUser>('User', userSchema);

export { User, IUser };
