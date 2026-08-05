import Logo from "./Logo";

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-[#242424] rounded-2xl p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
