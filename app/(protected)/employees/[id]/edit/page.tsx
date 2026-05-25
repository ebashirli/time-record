import EditEmployeePage from "@/components/EmployeeEditForm/edit-employee-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <EditEmployeePage id={id} />;
}
