import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: Date,
    image: String,
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  { timestamps: true },
);

accountSchema.index(
  { userId: 1, provider: 1, providerAccountId: 1 },
  { unique: true },
);

export const Account =
  mongoose.models.Account || mongoose.model<IAccount>("Account", accountSchema);

export interface ISession extends Document {
  sessionToken: string;
  userId: mongoose.Types.ObjectId;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionToken: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

export interface IVerificationToken extends Document {
  identifier: string;
  token: string;
  expires: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  identifier: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

verificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    verificationTokenSchema,
  );
