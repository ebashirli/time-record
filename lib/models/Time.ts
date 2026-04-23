import mongoose, { Schema, Document } from "mongoose";

export interface ITime extends Document {
  employeeId: string;
  postId: string;
  time: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ITime>(
  {
    employeeId: String,
    postId: String,
    time: Date,
  },
  { timestamps: true },
);

export const Time =
  mongoose.models.Time || mongoose.model<ITime>("Time", schema);
