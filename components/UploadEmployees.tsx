"use client";

import { useState, useTransition } from "react";
import { uploadExcel } from "@/actions/uploadEmployeesAction";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function UploadEmployees() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ message?: string; error?: string }>(
    {},
  );

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({});

    const formData = new FormData(event.currentTarget);
    const file = formData.get("excelFile") as File;

    if (!file || file.size === 0) {
      setStatus({ error: "Please select a valid Excel file." });
      return;
    }

    // Execute the Server Action inside a transition
    startTransition(async () => {
      const response = await uploadExcel(formData);
      if (response.success) toast.success(response.message);
      else toast.error(response.error);
    });
  };

  return (
    <Card className=" border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Data</CardTitle>
        <CardDescription>
          Upload your completed Excel file to process the data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excel File (.xlsx, .xls)
            </label>
            <input
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 "
              type="file"
              name="excelFile"
              accept=".xlsx, .xls"
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full gap-2 bg-primary"
          >
            <Upload className="w-4 h-4" />
            {isPending ? "Processing..." : "Upload file"}
          </Button>
        </form>

        {status.message && (
          <p className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm text-center">
            {status.message}
          </p>
        )}

        {status.error && (
          <p className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm text-center">
            {status.error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
