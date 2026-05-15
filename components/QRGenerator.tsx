"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function QRGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (inputValue.trim()) {
      setQrValue(inputValue);
      console.log("QR Code generated for:", inputValue);
    }
  };

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
        console.log("QR Code copied to clipboard");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleReset = () => {
    setInputValue("");
    setQrValue("");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Convert text or URLs into QR codes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Input field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="qr-input" className="text-sm font-medium">
              Enter text or URL
            </label>
            <Input
              id="qr-input"
              placeholder="e.g., https://example.com or Hello World"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          {/* Generate button */}
          <Button onClick={handleGenerate} className="w-full">
            Generate QR Code
          </Button>

          {/* QR Code display */}
          {qrValue && (
            <>
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <div ref={qrRef}>
                  <QRCodeCanvas
                    value={qrValue}
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
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Encoded:
                </p>
                <p className="text-sm text-blue-800 break-all font-mono">
                  {qrValue}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  Download as PNG
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="w-full"
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
