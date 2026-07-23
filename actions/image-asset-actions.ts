"use server";

import {
  checkEmployeeImages,
  type ImageCheckResult,
} from "@/lib/server/imageAssetSync";

export async function triggerImageRecheck(): Promise<ImageCheckResult> {
  return checkEmployeeImages();
}
