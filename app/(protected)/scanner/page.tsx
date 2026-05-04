import { SidebarRight } from "@/components/SidebarRight";
import QRScanner from "@/components/QRScanner";
import { SidebarInset } from "@/components/ui/sidebar";
import LastCheckins from "@/components/LastCheckins";

export default function ScannerPage() {
  return (
    <>
      <SidebarInset>
        <main className="p-8 w-full">
          <QRScanner />
          <div className="sm:hidden">
            <LastCheckins />
          </div>
        </main>
      </SidebarInset>
      <SidebarRight>
        <LastCheckins />
      </SidebarRight>
    </>
  );
}
