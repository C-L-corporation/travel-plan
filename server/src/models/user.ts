import { Schema, model } from 'mongoose';

type IUser = {
  name: string;
  email?: string;
  photo?: string;
  providers: ReadonlyArray<{ provider: string; userId: string }>;
};

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: String,
  providers: [{ provider: String, userId: String }],
});

const User = model<IUser>('User', userSchema);

export { User };
