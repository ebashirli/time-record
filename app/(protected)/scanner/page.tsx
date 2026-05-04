import QRScanner from "@/components/QRScanner";

export default function ScannerPage() {
  return (
    <main className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Scan QR Code</h1>
      <QRScanner />
    </main>
  );
}
