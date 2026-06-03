"use client";
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { QrCode } from "lucide-react";
import { CopyButton } from "./copy-button";

export function QRGenerator({ value }: { value?: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
    }
  };

  const handleCopy = async () => {
    const canvas = qrRef.current?.querySelector("canvas") as HTMLCanvasElement;
    if (canvas) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          });
        });
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer" size="icon">
          <QrCode className="" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          <div ref={qrRef}>
            <QRCodeCanvas
              value={value!}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>
        </div>

        {/* Display the encoded value */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Encoded:</p>
          <p className="text-sm text-blue-800 break-all font-mono">{value}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={handleDownload} variant="outline" className="w-full">
            Download as PNG
          </Button>
          {/* <Button onClick={handleCopy} variant="outline" className="w-full">
            Copy to Clipboard
          </Button> */}

          <CopyButton onCopy={handleCopy} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
