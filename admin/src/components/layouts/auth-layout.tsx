export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#f2f2f2]">
      {children}
    </div>
  );
}
