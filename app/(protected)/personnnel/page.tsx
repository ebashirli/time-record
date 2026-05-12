import CustomInfiniteScroll from "@/components/CustomInfiniteScroll";

export default async function Page() {
  return (
    <div className="max-h-[calc(100svh-var(--header-height))]! overflow-y-scroll">
      <CustomInfiniteScroll />
    </div>
  );
}
