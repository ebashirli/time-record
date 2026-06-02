import { getCheckins } from "@/actions/getChekins";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const paramsString = request.nextUrl.searchParams.toString();
  const result = await getCheckins(paramsString, true);

  console.log({ result });

  if (result instanceof Response) return result;

  return new Response("Export failed", { status: 500 });
}
