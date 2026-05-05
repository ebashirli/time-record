"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  // 1. Use a Ref to keep track of the scanner instance
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize if we are in scanning mode and the element exists
    if (!scanning || !document.getElementById("reader")) return;

    // 2. Initialize instance only if it doesn't exist
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }, // Increased size for better scanning
          aspectRatio: 1.0,
        },
        /* verbose= */ false,
      );
    }

    const onScanSuccess = async (result: string) => {
      // Important: Stop the scanner immediately on success
      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch (e) {
          console.error("Failed to clear scanner", e);
        }
      }

      async function handleCheckIn(employeeId: string) {
        try {
          const response = await fetch("/api/checkins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employeeId: employeeId.trim() }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Check-in failed");

          setMessage({
            type: "success",
            text: `Check-in successful for ${data.employee.name}!`,
          });

          setTimeout(() => {
            setMessage(null);
            setScanning(true);
          }, 2000);

          router.refresh();
        } catch (err) {
          setMessage({
            type: "error",
            text: err instanceof Error ? err.message : "Check-in failed",
          });
          setTimeout(() => {
            setScanning(true);
            setMessage(null);
          }, 3000);
        }
      }

      setScanning(false);
      await handleCheckIn(result);
    };

    const onScanFailure = (error: string) => {
      console.warn(error);
      // Scanning errors are common (no QR in frame), usually safe to ignore
    };

    scannerRef.current.render(onScanSuccess, onScanFailure);

    // Cleanup: Clear the scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Cleanup error", err));
        scannerRef.current = null;
      }
    };
  }, [scanning, router]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Scan QR Code</h1>
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          <p>{message.text}</p>
        </div>
      )}
      {/* 3. Keep the div in the DOM but control visibility if needed */}
      <div id="reader" style={{ display: scanning ? "block" : "none" }}></div>
      {!scanning && !message && <p className="text-center">Processing...</p>}
    </div>
  );
};

export default QRScanner;
