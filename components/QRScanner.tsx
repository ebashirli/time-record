"use client";

import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    scanner.render(success, error);

    async function success(result: string) {
      scanner.clear();
      setScanning(false);

      try {
        // Parse the QR code result (expecting employeeId)
        const employeeId = result.trim();

        // Call the check-in API
        const response = await fetch("/api/checkins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Check-in failed");
        }

        setMessage({
          type: "success",
          text: `Check-in successful for ${data.employee.name}!`,
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          setMessage(null);
          setScanning(true);
          // router.push("/scanner"); // Or wherever you want to redirect
        }, 2000);
      } catch (err) {
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Check-in failed",
        });

        // Allow scanning again after error
        setTimeout(() => {
          setScanning(true);
          setMessage(null);
        }, 3000);
      }
    }

    function error() {
      // errorMessage: string
      // Only log errors, don't show to user (scanning errors are common)
      // console.warn(`QR Code scan error: ${errorMessage}`);
    }

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [router, scanning]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Scan QR Code</h1>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {scanning && <div id="reader"></div>}

      {!scanning && !message && (
        <div className="text-center">
          <p className="text-gray-600">Processing check-in...</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
