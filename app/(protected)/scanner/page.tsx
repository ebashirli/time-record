import { CustomRightSheet } from "@/components/CustomRightSheet";
import { QRScanner } from "@/components/QRScanner";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";
import { LatestCheckins } from "@/components/LatestCheckins";

export default async function ScannerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  const checkins = await prisma.checkin.findMany({
    where: {
      checkedById: user?.id,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      employee: {
        select: {
          image: true,
          fullName: true,
          firstName: true,
          lastName: true,
          company: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="flex flex-col h-full p-8 items-center ">
      <QRScanner>
        <CustomRightSheet>
          <LatestCheckins checkins={checkins} />
        </CustomRightSheet>
      </QRScanner>
    </div>
  );
}
