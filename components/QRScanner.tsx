"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const QRScanner = () => {
  // const [scanResult, setScanResult] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    scanner.render(success, error);

    function success(result: string) {
      scanner.clear();
      router.push(`/time/${result}`);
    }

    function error(errorMessage: string) {
      console.warn(`QR Code scan error: ${errorMessage}`);
    }

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [router]);

  return <div id="reader"></div>;
};

export default QRScanner;
