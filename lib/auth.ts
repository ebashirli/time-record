// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { nextCookies } from "better-auth/next-js";

// const uri =
//   process.env.MONGODB_URI?.replace(
//     "<password>",
//     process.env.MONGODB_PASSWORD ?? "",
//   ) ?? "";

// const client = new MongoClient(uri);
// const db = client.db();

// export const auth = betterAuth({
//   database: mongodbAdapter(db, { client }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.AUTH_GOOGLE_ID ?? "",
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     },
//   },
//   plugins: [nextCookies()],
// });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
});
