import { CustomRightSheet } from "@/components/CustomRightSheet";
import { QRScanner } from "@/components/QRScanner";

import { LatestCheckins } from "@/components/LatestCheckins";
// import { TerminalUserSettings } from "@/components/TerminalUserSettings";
// import { getServerSession, isTerminalRole } from "@/lib/auth-session";

export default async function ScannerPage() {
  // const session = await getServerSession();
  // const isTerminal = isTerminalRole(session?.user.role);

  return (
    <div className="flex min-h-svh flex-col justify-center items-center p-4 sm:p-8">
      <QRScanner>
        <div className="flex justify-center items-center gap-2">
          <CustomRightSheet>
            <LatestCheckins />
          </CustomRightSheet>
          {/* {isTerminal && <TerminalUserSettings />} */}
        </div>
      </QRScanner>
    </div>
  );
}
