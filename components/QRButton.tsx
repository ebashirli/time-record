import { useRef } from "react";
import { QrCode } from "lucide-react";
import { Button } from "./ui/button";

export default function QRButton() {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full sm:ml-auto sm:w-auto"
        variant="outline"
        aria-label="Open Camera"
      >
        <QrCode />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </>
  );
}
