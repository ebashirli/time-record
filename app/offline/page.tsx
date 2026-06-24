import { redirect } from "next/navigation";

export default function OfflinePage() {
  redirect("/scanner");
  // return (
  //   <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
  //     <h1 className="text-2xl font-semibold">You{`'`}re offline</h1>
  //     <p className="text-muted-foreground">
  //       Check your connection. Once you{`'`}re back online, check-ins will sync
  //       again.
  //     </p>
  //   </div>
  // );
}
