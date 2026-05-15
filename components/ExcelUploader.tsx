"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface UploadedData {
  sheetName: string;
  rows: number;
  columns: number;
  data: any[];
}

export function ExcelUploader() {
  const [fileName, setFileName] = useState<string>("");
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);
    processFile(file);
  };

  const processFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const result: UploadedData = {
          sheetName: firstSheetName,
          rows: jsonData.length,
          // columns: jsonData.length > 0 ? Object.keys(jsonData[0]).length : 0,
          columns: jsonData.length > 0 ? Object.keys(10).length : 0,
          data: jsonData,
        };

        setUploadedData(result);
        console.log("[v0] Excel file uploaded successfully:", result);
        console.log("[v0] Data:", jsonData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to parse file";
        setError(errorMessage);
        console.error("[v0] Error parsing Excel file:", err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Data</CardTitle>
        <CardDescription>
          Upload your completed Excel file to process the data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full gap-2 bg-green-600 hover:bg-green-700"
          >
            <Upload className="w-4 h-4" />
            {isLoading ? "Processing..." : "Choose Excel File"}
          </Button>

          {fileName && (
            <p className="text-sm text-slate-300">
              Selected:{" "}
              <span className="font-semibold text-slate-100">{fileName}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="flex gap-2 items-start p-3 bg-red-900/20 border border-red-700 rounded">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {uploadedData && (
          <div className="flex flex-col gap-3 p-3 bg-green-900/20 border border-green-700 rounded">
            <div className="flex gap-2 items-start">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-400">
                  Upload Successful
                </p>
                <div className="text-sm text-green-300 space-y-1 mt-2">
                  <p>
                    Sheet:{" "}
                    <span className="font-semibold">
                      {uploadedData.sheetName}
                    </span>
                  </p>
                  <p>
                    Rows:{" "}
                    <span className="font-semibold">{uploadedData.rows}</span>
                  </p>
                  <p>
                    Columns:{" "}
                    <span className="font-semibold">
                      {uploadedData.columns}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {uploadedData.data.length > 0 && (
              <div className="mt-3 p-2 bg-slate-700 rounded text-xs overflow-x-auto">
                <p className="text-slate-300 mb-2 font-semibold">Preview:</p>
                <pre className="text-slate-200">
                  {JSON.stringify(uploadedData.data.slice(0, 3), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
