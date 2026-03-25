import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement {
  title: string;
  icon: string;
  description: string;
  awardedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  approved: boolean;
  googleId?: string;
  points: number;
  achievements: IAchievement[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
  approved: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  points: { type: Number, default: 0 },
  achievements: [{
    title: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
