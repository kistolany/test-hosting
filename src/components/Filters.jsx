function Filters({
  search,
  gender,
  major,
  year,
  shift,
  majorOptions,
  yearOptions,
  shiftOptions,
  onSearchChange,
  onGenderChange,
  onMajorChange,
  onYearChange,
  onShiftChange
}) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search student name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
        />
        <select
          value={gender}
          onChange={(event) => onGenderChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
        >
          <option value="All">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={major}
          onChange={(event) => onMajorChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
        >
          <option value="All">All majors</option>
          {majorOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => onYearChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
        >
          <option value="All">All years</option>
          {yearOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={shift}
          onChange={(event) => onShiftChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
        >
          <option value="All">All shifts</option>
          {shiftOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default Filters;
