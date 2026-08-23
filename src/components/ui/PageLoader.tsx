export default function PageLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#D32F2F]/20" />
        <div className="w-16 h-16 rounded-full border-4 border-[#D32F2F] border-t-transparent animate-spin absolute top-0 left-0" />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {message}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Free tier servers may take up to 60s to wake up
        </p>
      </div>
    </div>
  );
}
