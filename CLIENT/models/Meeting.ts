import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  meetLink: string;
  date: Date;
  createdAt: Date;
}

const MeetingSchema: Schema = new Schema({
  title: { type: String, required: true },
  meetLink: { type: String, required: true },
  date: { type: Date, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
