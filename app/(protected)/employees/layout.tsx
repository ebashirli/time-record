import EmployeesPage from "@/components/pages/EmployeesPage";

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative">
      <EmployeesPage />

      {children}
    </div>
  );
}
