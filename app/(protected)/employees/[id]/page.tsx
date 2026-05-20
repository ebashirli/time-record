type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Employee Profile</h1>
      <div className="border p-6 rounded-lg bg-card">
        {/* Reuse the exact same form component here */}
        <p>Full page editor for employee {id}</p>
      </div>
    </div>
  );
}
