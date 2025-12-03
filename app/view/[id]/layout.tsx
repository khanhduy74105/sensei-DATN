// app/resume/[id]/layout.tsx
export default function PublicResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-6">
      {children}
    </div>
  );
}
