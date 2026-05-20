"use client";
import React, { useEffect, useTransition } from "react";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type Props<T> = {
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  children: React.ReactElement;
  getAction: (params: { [k: string]: null | string | number }) => Promise<{
    error?: string;
    success: boolean;
    data?: T[];
    total?: number;
  }>;
};

const CustomInfiniteScroll = <T,>({
  children,
  setData,
  getAction,
}: Props<T>) => {
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const next = () => {
    setPage((prev) => prev + 1);
  };

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScanSuccess = ({
      query,
      page,
    }: {
      query: string | null;
      page: string | number;
    }) => {
      startTransition(async () => {
        const { success, data, error, total } = await getAction({
          query,
          page,
          limit: 12,
        });
        if (!success) {
          setHasMore(false);
          toast.error(error);
        }
        if (!data || (total ?? 0) <= data.length) setHasMore(false);
        setData((prev) => [...prev, ...(data ?? [])]);
      });
    };

    handleScanSuccess({ query, page });
  }, [query, page, setData, getAction]);

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
