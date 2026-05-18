import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DownloadTemplateButton from "@/components/DownloadTemplateButton";
import UploadEmployees from "@/components/UploadEmployees";

export default function Page() {
  return (
    <main className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl">Download Template</CardTitle>
            <CardDescription>
              Get our Excel template for your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Download the empty Excel template to start entering your data. The
              template includes pre-formatted columns and sheets ready for use.
            </p>
            <DownloadTemplateButton />
          </CardContent>
        </Card>

        <UploadEmployees />
      </div>
    </main>
  );
}
