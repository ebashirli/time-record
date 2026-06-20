import { Role } from "@/prisma/lib/generated/prisma/enums";

export type User = {
  "#"?: number;
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
  createdAt: Date;
};
