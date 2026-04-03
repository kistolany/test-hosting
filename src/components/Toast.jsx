function Toast({ show, message }) {
  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}

export default Toast;
