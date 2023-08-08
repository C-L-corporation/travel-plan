import { ObjectId, Schema, model } from 'mongoose';

type IUser = {
  name: string;
  email: string;
  photo: string;
  providers: { provider: string; userId: string; username?: string }[];
  admin: boolean;
  plans: ReadonlyArray<ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  photo: { type: String, default: null },
  providers: {
    type: [
      {
        provider: { type: String, required: true },
        userId: { type: String, required: true },
        username: { type: String, default: null },
      },
    ],
    default: [],
  },
  admin: { type: Boolean, default: false },
  plans: { type: [{ type: Schema.Types.ObjectId, ref: 'Plan' }], default: [] },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: null },
});

userSchema.index(
  { 'providers.provider': 1, 'providers.userId': 1 },
  { unique: true }
);

const User = model<IUser>('User', userSchema);

export { User, IUser };
