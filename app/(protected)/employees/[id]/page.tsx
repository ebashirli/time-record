import EmployeeModal from "@/components/EmployeeModal";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { position: true, department: true },
  });
  return <EmployeeModal employee={employee} />;
}
