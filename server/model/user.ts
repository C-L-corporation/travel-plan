import { Schema, model } from 'mongoose';

type User = {
  name: string;
  email?: string;
  photo?: string;
  providers: ReadonlyArray<{ provider: string; userId: string }>;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  photo: String,
  providers: { type: [{ provider: String, userId: String }], required: true },
});

const User = model<User>('User', userSchema);

export default User;
