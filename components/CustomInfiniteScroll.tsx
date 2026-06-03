"use client";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import {
  TGetAction,
  TSetData,
  useCustomInfiniteScroll,
} from "@/hooks/useCustomInfiniteScroll";
import { cn } from "@/lib/utils";

type I = { id: string };

type Props<T extends I> = {
  setData: TSetData<T>;
  children: React.ReactElement;
  getAction: TGetAction<T>;
  className?: string;
};

const CustomInfiniteScroll = <T extends I>({
  children,
  setData,
  getAction,
  className,
}: Props<T>) => {
  const { hasMore, isPending, next } = useCustomInfiniteScroll(
    getAction,
    setData,
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div
        className={cn("grid auto-rows-min gap-4 md:grid-cols-4 ", className)}
      >
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
