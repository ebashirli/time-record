import { CustomSheet } from "@/components/CustomSheet";
// import QRScanner from "@/components/QRScanner";
import { QRScannerNew } from "@/components/QrScannerNew";

export default function ScannerPage() {
  return (
    <div className="flex flex-col h-full p-8 items-center ">
      {/* <QRScanner /> */}
      <QRScannerNew />
      <CustomSheet />
    </div>
  );
}
