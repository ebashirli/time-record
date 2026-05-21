import { LatestCheckinListSheet } from "@/components/LatestCheckinListSheet";
import { QRScanner } from "@/components/QRScanner";

export default function ScannerPage() {
  return (
    <div className="flex flex-col h-full p-8 items-center ">
      <QRScanner>
        <LatestCheckinListSheet />
      </QRScanner>
    </div>
  );
}
