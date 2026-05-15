"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const DownloadTemplateButton = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/personel_sablon.xlsx";
    link.download = "employees_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownload} className="w-full gap-2">
      <Download className="w-4 h-4" />
      Download Excel Template
    </Button>
  );
};

export default DownloadTemplateButton;
