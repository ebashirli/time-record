import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export const useQRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!!scannedCode) return; // Prevent re-initializing scanner when a code is scanned
    if (!videoRef.current) return;

    const startScanning = async () => {
      try {
        setError("");

        const scanner = new QrScanner(
          videoRef.current!,
          async (result) => {
            const decodedResult = result.data;
            setScannedCode(decodedResult);
          },
          {
            onDecodeError: (/*error*/) => {
              // Silently handle decode errors during scanning
            },
            preferredCamera: "environment",
            maxScansPerSecond: 5,
          },
        );

        scannerRef.current = scanner;
        setIsScanning(true);
        await scanner.start();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to access camera";
        console.error("[v0] Camera error:", err);
        setError(errorMessage);
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, [scannedCode]);

  const handleStop = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const handleResume = async () => {
    if (scannerRef.current) {
      await scannerRef.current.start();
      setIsScanning(true);
    }
  };

  const handleReset = () => {
    setScannedCode("");
    setError("");
  };

  return {
    handleStop,
    handleResume,
    handleReset,
    setScannedCode,

    videoRef,
    error,
    isScanning,
    scannedCode,
  };
};
