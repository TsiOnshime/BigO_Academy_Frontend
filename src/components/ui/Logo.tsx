export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      </div>
      <span className="text-xl font-semibold text-white">BigO Academy</span>
    </div>
  );
}
