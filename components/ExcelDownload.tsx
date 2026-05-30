"use client";

import { Table } from "lucide-react";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ExcelDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const searchParams = useSearchParams();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // 1. Construct URLSearchParams based on current state
      const params = new URLSearchParams();
      const company = searchParams.get("company");
      const query = searchParams.get("query");
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      if (company) params.append("company", company);
      if (query) params.append("query", query);
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      // 2. Fetch from API route with query string (e.g., /api/checkins?query=john&role=ADMIN)
      const response = await fetch(`/api/checkins?${params.toString()}`);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download Excel file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      // asChild
      className="p-1 flex items-center justify-center "
    >
      {isDownloading ? (
        <Spinner className="h-8 w-8 mr-2" />
      ) : (
        <Table className="h-8 w-8 mr-2" />
      )}
    </Button>
  );
}
