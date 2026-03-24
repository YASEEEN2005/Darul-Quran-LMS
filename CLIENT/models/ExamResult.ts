import mongoose, { Schema, Document } from 'mongoose';

export interface IExamResult extends Document {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  score: number;
  completed: boolean;
  createdAt: Date;
}

const ExamResultSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  completed: { type: Boolean, default: true },
}, { timestamps: true });

ExamResultSchema.index({ userId: 1, examId: 1 }, { unique: true });

export default mongoose.models.ExamResult || mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
