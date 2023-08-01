import { ObjectId, Schema, model } from 'mongoose';

type IUser = {
  name: string;
  email: string;
  photo: string;
  providers: { provider: string; userId: string }[];
  isAdmin: boolean;
  plans: ReadonlyArray<ObjectId>;
  createdAt: Date;
  updateAt: Date;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String, default: null },
  providers: { type: [{ provider: String, userId: String }], default: [] },
  isAdmin: { type: Boolean, default: false },
  plans: { type: [{ type: Schema.Types.ObjectId, ref: 'Plan' }], default: [] },
  createdAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: null },
});

const User = model<IUser>('User', userSchema);

export { User, IUser };
