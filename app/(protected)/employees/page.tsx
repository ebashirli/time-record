import EmployeesPage from "@/components/pages/EmployeesPage";

export default async function Page() {
  return (
    <div className="max-h-[calc(100svh-var(--header-height))]! overflow-y-scroll">
      <EmployeesPage />
    </div>
  );
}
