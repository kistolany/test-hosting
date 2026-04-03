function Header({ onOpenEdit }) {

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onOpenEdit}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
      >
        Edit Class
      </button>
    </div>
  );
}

export default Header;
