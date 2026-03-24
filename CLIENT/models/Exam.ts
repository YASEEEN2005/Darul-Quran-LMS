import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface IExam extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  orderIndex: number;
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
}, { timestamps: true });

const ExamSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  orderIndex: { type: Number, required: true },
  questions: [QuestionSchema],
}, { timestamps: true });

ExamSchema.index({ courseId: 1, orderIndex: 1 }, { unique: true });

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
