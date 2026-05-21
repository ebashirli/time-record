"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ScanResultSubmitDialog } from "./ScanResultSubmitDialog";
import { useQRScanner } from "@/hooks/useQRScanner";

export function QRScanner({ children }: { children?: React.ReactElement }) {
  const {
    handleStop,
    handleResume,
    handleReset,
    setScannedCode,
    videoRef,
    error,
    isScanning,
    scannedCode,
  } = useQRScanner();

  return (
    <>
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-4">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>
              Point your camera at a QR code to scan it
            </CardDescription>
            <CardAction>{children}</CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Video element for camera feed */}
            <div className="relative w-full rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full aspect-square object-cover"
                playsInline
              />
            </div>

            {/* Status and controls */}
            <div className="flex gap-2">
              {isScanning ? (
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  className="flex-1"
                >
                  Stop Scanning
                </Button>
              ) : (
                <Button onClick={handleResume} className="flex-1">
                  Resume Scanning
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Scanned result display */}
            {scannedCode && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">
                  QR Code Result:
                </p>
                <p className="text-sm text-green-800 break-all font-mono">
                  {scannedCode}
                </p>
              </div>
            )}

            {/* Status indicator */}
            {!error && !scannedCode && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {isScanning ? "Scanning..." : "Ready to scan"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ScanResultSubmitDialog cardId={scannedCode} setIdCard={setScannedCode} />
    </>
  );
}
