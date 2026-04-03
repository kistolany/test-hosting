import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { ClassCard } from "../components/Cards";

function getClassPrograms(classItem) {
  if (Array.isArray(classItem.programs) && classItem.programs.length > 0) {
    return classItem.programs;
  }

  return [{ major: classItem.major, year: classItem.year, shift: classItem.shift }];
}

function ClassList({ classes }) {
  const navigate = useNavigate();
  const { isDark } = useOutletContext();
  const { t, lang } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");

  const brandBlue = isDark ? "#93c5fd" : "#1d4ed8";
  const normalizedSearchText = searchText.trim().toLowerCase();

  const classOptions = useMemo(() => {
    const majorSet = new Set();
    const yearSet = new Set();
    const shiftSet = new Set();

    classes.forEach((classItem) => {
      getClassPrograms(classItem).forEach((program) => {
        if (program.major) majorSet.add(program.major);
        if (program.year) yearSet.add(program.year);
        if (program.shift) shiftSet.add(program.shift);
      });
    });

    return {
      majorOptions: [...majorSet].sort((a, b) => a.localeCompare(b)),
      yearOptions: [...yearSet].sort((a, b) => a.localeCompare(b)),
      shiftOptions: [...shiftSet].sort((a, b) => a.localeCompare(b))
    };
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter((classItem) => {
      const programs = getClassPrograms(classItem);

      const matchedSelectFilters = programs.some((program) => {
        const majorMatch = selectedMajor === "All" || program.major === selectedMajor;
        const yearMatch = selectedYear === "All" || program.year === selectedYear;
        const shiftMatch = selectedShift === "All" || program.shift === selectedShift;

        return majorMatch && yearMatch && shiftMatch;
      });

      if (!matchedSelectFilters) {
        return false;
      }

      if (!normalizedSearchText) {
        return true;
      }

      const searchableParts = [
        classItem.name,
        classItem.major,
        classItem.year,
        classItem.shift,
        ...programs.flatMap((program) => [program.major, program.year, program.shift])
      ];

      return searchableParts
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchText);
    });
  }, [classes, normalizedSearchText, selectedMajor, selectedYear, selectedShift]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedMajor("All");
    setSelectedYear("All");
    setSelectedShift("All");
  };

  return (
    <main className="min-h-screen bg-transparent py-8">
      <section className="w-full">
        <div className="-mt-[20px] text-center">
          <h1
            className={`text-3xl ${
              lang === "km"
                ? "khmer-moul-light font-normal tracking-normal leading-[1.5]"
                : "font-black tracking-tight"
            }`}
            style={{ color: brandBlue }}
          >
            {t("classManagementPage.title")}
          </h1>
        </div>

        <section className="mt-[30px] rounded-2xl">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder={t("classManagementPage.searchClassPlaceholder")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                isDark
                  ? "border-slate-600 bg-transparent text-slate-100 placeholder:text-slate-400 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] focus:border-cyan-400"
                  : "border-blue-200 bg-transparent text-slate-800 placeholder:text-slate-500 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />

            <select
              value={selectedMajor}
              onChange={(event) => setSelectedMajor(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                isDark
                  ? "border-slate-600 bg-transparent text-slate-100 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] focus:border-cyan-400"
                  : "border-blue-200 bg-transparent text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            >
              <option value="All">{t("classManagementPage.allMajors")}</option>
              {classOptions.majorOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                isDark
                  ? "border-slate-600 bg-transparent text-slate-100 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] focus:border-cyan-400"
                  : "border-blue-200 bg-transparent text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            >
              <option value="All">{t("classManagementPage.allYears")}</option>
              {classOptions.yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={selectedShift}
              onChange={(event) => setSelectedShift(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                isDark
                  ? "border-slate-600 bg-transparent text-slate-100 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] focus:border-cyan-400"
                  : "border-blue-200 bg-transparent text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            >
              <option value="All">{t("classManagementPage.allShifts")}</option>
              {classOptions.shiftOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isDark
                  ? "border-slate-500 bg-transparent text-slate-100 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.95)] hover:bg-transparent"
                  : "border-blue-200 bg-transparent text-blue-800 shadow-[0_14px_26px_-16px_rgba(30,64,175,0.55)] hover:bg-transparent hover:shadow-[0_18px_32px_-18px_rgba(30,64,175,0.6)]"
              }`}
            >
              {t("actions.clear")}
            </button>
          </div>

        </section>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onView={() => navigate(`/class/${classItem.id}`)}
            />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <p className={`mt-6 text-center text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {t("classManagementPage.emptyState")}
          </p>
        )}
      </section>
    </main>
  );
}

export default ClassList;
