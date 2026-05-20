import CompaniesPage from "@/components/pages/CompaniesPage";

export default async function Page() {
  return (
    <div className="max-h-[calc(100svh-var(--header-height))]!">
      <CompaniesPage />
    </div>
  );
}
