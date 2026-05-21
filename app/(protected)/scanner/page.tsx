import { CustomRightSheet } from "@/components/CustomRightSheet";
import { QRScanner } from "@/components/QRScanner";

import { LatestCheckins } from "@/components/LatestCheckins";

export default async function ScannerPage() {
  return (
    <div className="flex flex-col h-full p-8 items-center ">
      <QRScanner>
        <CustomRightSheet>
          <LatestCheckins />
        </CustomRightSheet>
      </QRScanner>
    </div>
  );
}
