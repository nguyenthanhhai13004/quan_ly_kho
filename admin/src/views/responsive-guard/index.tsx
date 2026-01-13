export default function ResponsiveGuard() {
  return (
    <div
      className="sm:hidden fixed inset-0 z-9999 flex items-center justify-center bg-black/90 pointer-events-auto"
      role="alert"
      aria-live="assertive"
      aria-label="Thiết bị không được hỗ trợ"
    >
      <div className="max-w-[420px] mx-4 p-6 rounded-xl bg-white/5 backdrop-blur-md text-white text-center">
        <h2 className="text-lg font-semibold mb-2">Thiết bị không được hỗ trợ</h2>
        <p className="text-sm">
          Ứng dụng chỉ chấp nhận tablet trở lên. Vui lòng mở trên tablet hoặc máy tính.
        </p>
      </div>
    </div>
  );
}
