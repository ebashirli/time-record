import React, { useEffect, useRef, useTransition, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export type TGetAction<T> = (paramsString: string) => Promise<{
  error?: string;
  success: boolean;
  data?: T[];
  total?: number;
}> | null;

export type TSetData<T> = React.Dispatch<React.SetStateAction<T[]>>;

export const useCustomInfiniteScroll = <T extends { id: string }>(
  getAction: TGetAction<T>,
  setData: TSetData<T>,
) => {
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const stableGetAction = useRef(getAction);
  useEffect(() => {
    stableGetAction.current = getAction;
  }, [getAction]);

  useEffect(() => {
    let isMounted = true;
    const page = Number(searchParams.get("page") ?? "0");

    // Reset data on mount if it's the first page
    if (page === 0) setData([]);

    startTransition(async () => {
      const { success, data, error, total } = (await stableGetAction.current(
        searchParams.toString(),
      )) ?? { success: false, error: "No getAction provided" };

      if (!isMounted) return;

      if (!success) {
        setHasMore(false);
        toast.error(error || "Failed to fetch data");
        return;
      }

      const fetchedData = data ?? [];

      setData((prev) => {
        if (page === 0) return fetchedData;

        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewData = fetchedData.filter(
          (item) => !existingIds.has(item.id),
        );
        return [...prev, ...uniqueNewData];
      });

      if (
        fetchedData.length === 0 ||
        (total !== undefined && page * 12 + fetchedData.length >= total)
      )
        setHasMore(false);
    });

    return () => {
      isMounted = false;
    };
  }, [setData, searchParams]);

  const next = () => {
    const params = new URLSearchParams(searchParams);
    const page = Number(params.get("page") ?? 0);
    if (!isPending && hasMore) params.set("page", String(page + 1));
    else params.delete("page");
  };

  return { hasMore, isPending, next };
};
