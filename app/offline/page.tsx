import { WifiOff } from "lucide-react";
import { OfflineStatus } from "@/components/OfflineStatus";

export default function OfflinePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <WifiOff className="h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">İnternet bağlantısı yoxdur</h1>
      <p className="text-muted-foreground">
        Bağlantını yoxlayın. Bərpa olunan kimi tətbiq avtomatik olaraq
        skanerə qayıdacaq.
      </p>
      <OfflineStatus />
    </div>
  );
}
