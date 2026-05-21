"use client";

import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query");

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set("query", term);
    else params.delete("query");

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  if (pathname === "/scanner") return null;
  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={query ?? ""}
        />
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  );
}
