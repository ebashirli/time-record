import { CustomSheet } from "@/components/CustomSheet";
import { QRScannerNew } from "@/components/QrScannerNew";

export default function ScannerPage() {
  return (
    <div className="flex flex-col h-full p-8 items-center ">
      <QRScannerNew />
      <CustomSheet />
    </div>
  );
}
