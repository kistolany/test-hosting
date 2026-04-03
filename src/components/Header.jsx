import { useNavigate } from "react-router-dom";

function Header({ classItem, onOpenEdit, backPath = "/classes" }) {
  const navigate = useNavigate();

  return (
    <header className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="mb-3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Class {classItem.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {classItem.major} | {classItem.year} | {classItem.shift}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenEdit}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          Edit Class
        </button>
      </div>
    </header>
  );
}

export default Header;
