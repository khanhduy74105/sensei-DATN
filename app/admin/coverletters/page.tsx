import { db } from "@/lib/prisma";

export default async function AdminResumePage() {
  const resumes = await db.resume.findMany({ take: 50, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resumes</h2>
      <table className="min-w-full border bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.title}</td>
              <td className="p-2 border">{r.userId}</td>
              <td className="p-2 border">{r.createdAt.toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
