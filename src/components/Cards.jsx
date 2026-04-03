export function ClassCard({ classItem, onView }) {
  const programs =
    Array.isArray(classItem.programs) && classItem.programs.length > 0
      ? classItem.programs
      : [{ major: classItem.major, year: classItem.year, shift: classItem.shift }];

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
        Class {classItem.name}
      </div>
      <div className="space-y-1">
        {programs.map((program, index) => (
          <p key={`${program.major}-${program.year}-${program.shift}-${index}`} className="text-sm text-slate-700">
            {program.major} | {program.year} | {program.shift}
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onView}
        className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        View
      </button>
    </article>
  );
}

export function SummaryCards({ classItem, studentsCount }) {
  const cards = [
    { label: "Total Students", value: studentsCount },
    { label: "Total Subjects", value: classItem.subjects.length },
    { label: "Year", value: classItem.year },
    { label: "Shift", value: classItem.shift }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
