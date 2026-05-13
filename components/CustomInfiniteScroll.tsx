"use client";
import React from "react";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";

type Props<N extends string, T> = {
  children: React.ReactElement;
  setData: (data: Record<N, T[]>) => void;
};

const CustomInfiniteScroll = <N extends string, T>({
  children,
  setData,
}: Props<N, T>) => {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const LIMIT = 12;

  const next = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/employees?limit=${LIMIT}&skip=${LIMIT * page}`,
      );
      const data = await res.json();

      setData(data);
      setPage((prev) => prev + 1);

      // Check if there are more employees to load
      if (data.employees.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
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
