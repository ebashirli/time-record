import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri =
  process.env.MONGODB_URI?.replace(
    "<password>",
    process.env.MONGODB_PASSWORD ?? "",
  ) ?? "";

const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    },
  },
});
