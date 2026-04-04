function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = "Save", isDark = false }) {
  if (!isOpen) return null;

  const panelClass = isDark
    ? "w-full max-w-md rounded-xl bg-[#001529] p-5 shadow-xl ring-1 ring-[#1f3e6d]"
    : "w-full max-w-md rounded-xl bg-white p-5 shadow-xl";

  const titleClass = isDark ? "text-lg font-bold text-slate-100" : "text-lg font-bold text-slate-900";

  const cancelButtonClass = isDark
    ? "rounded-lg border border-[#2f548a] px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-[#0d2b52]"
    : "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700";

  const confirmButtonClass = isDark
    ? "rounded-lg bg-[#123b73] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a4d96]"
    : "rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4" onClick={onClose}>
      <div
        className={panelClass}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className={titleClass}>{title}</h3>
        <div className="mt-4">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={cancelButtonClass}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmButtonClass}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
