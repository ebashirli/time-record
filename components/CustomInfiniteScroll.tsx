"use client";
import React, { useEffect, useRef, useTransition, useState } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type I = { id: string };
type Props<T extends I> = {
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  children: React.ReactElement;
  getAction: (params: {
    page: number;
    limit: number;
    query: null | string;
  }) => Promise<{
    error?: string;
    success: boolean;
    data?: T[];
    total?: number;
  }>;
};

const CustomInfiniteScroll = <T extends I>({
  children,
  setData,
  getAction,
}: Props<T>) => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [isPending, startTransition] = useTransition();

  const stableGetAction = useRef(getAction);
  useEffect(() => {
    stableGetAction.current = getAction;
  }, [getAction]);

  useEffect(() => {
    let isMounted = true;

    // Reset data on mount if it's the first page
    if (page === 0) {
      setData([]);
    }

    startTransition(async () => {
      const { success, data, error, total } = await stableGetAction.current({
        query,
        page,
        limit: 12,
      });

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
      ) {
        setHasMore(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [query, page, setData]);

  const next = () => {
    if (!isPending && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 ">
        {children}
        <div className="col-span-full flex justify-center">
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={isPending}
            next={next}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default CustomInfiniteScroll;
