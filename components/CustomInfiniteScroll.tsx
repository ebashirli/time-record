"use client";
import React from "react";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props<T> = {
  setData: (data: T[]) => void;
  children: React.ReactElement;
  name: string;
};

const CustomInfiniteScroll = <T,>({ children, setData, name }: Props<T>) => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const LIMIT = 12;

  const next = async () => {
    // 🛑 GUARD: If we are already loading, break out immediately
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/${name}?limit=${LIMIT}&skip=${LIMIT * page}`,
      );
      const { data, error } = await res.json();

      if (error) {
        setHasMore(false);
        return toast.error(error);
      }

      // Set data and increment page
      setData(data);
      setPage((prev) => prev + 1);

      if (!data || data.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4 ">
        {children}

        <div className="col-span-full flex justify-center">
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
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
