import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  videoUrl: string;
  orderIndex: number;
  moduleNumber: number;
  createdAt: Date;
}

const LessonSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  orderIndex: { type: Number, required: true },
  moduleNumber: { type: Number, default: 1 },
}, { timestamps: true });

LessonSchema.index({ courseId: 1, orderIndex: 1 }, { unique: true });

export default mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);
