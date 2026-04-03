import "../component/ClassCardModern.css";
import { FiMonitor, FiBriefcase, FiZap, FiSun, FiMoon, FiCalendar } from "react-icons/fi";

const majorIcons = {
  "Computer Science": <FiMonitor className="program-icon" />,
  "Business Administration": <FiBriefcase className="program-icon" />,
  "Electrical Engineering": <FiZap className="program-icon" />,
};

const shiftIcons = {
  Morning: <FiSun className="shift-icon" />,
  Evening: <FiMoon className="shift-icon" />,
  "Sunday-Saturday": <FiCalendar className="shift-icon" />
};

function getShiftToneClass(shift) {
  const normalizedShift = (shift || "").toLowerCase();

  if (normalizedShift.includes("morning")) return "shift-morning";
  if (normalizedShift.includes("evening") || normalizedShift.includes("night")) {
    return "shift-evening";
  }
  if (
    normalizedShift.includes("sunday") ||
    normalizedShift.includes("saturday") ||
    normalizedShift.includes("week")
  ) {
    return "shift-week";
  }

  return "shift-default";
}

export function ClassCard({ classItem, onView }) {
  const classBadgeText = String(classItem.name || "");

  const programs =
    Array.isArray(classItem.programs) && classItem.programs.length > 0
      ? classItem.programs
      : [{ major: classItem.major, year: classItem.year, shift: classItem.shift }];

  return (
    <article
      className="class-card-modern"
      onClick={onView}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView();
        }
      }}
    >
      <div className="class-name">{classBadgeText}</div>
      <div className="program-list">
        {programs.map((program, index) => {
          const yearNumber = (program.year || "").replace(/\D/g, "");

          return (
            <div className="program-row" key={`${program.major}-${program.year}-${program.shift}-${index}`}>
              <span className="program-icon-box">
                {majorIcons[program.major] || <FiMonitor className="program-icon" />}
              </span>

              <div className="program-content">
                <div className="program-head">
                  <span className="program-major">{program.major}</span>
                </div>

                <div className={`program-sub ${getShiftToneClass(program.shift)}`}>
                  <span className="program-year-group">
                    <span className="program-year-number">({yearNumber || "-"})</span>
                    <span className="program-year-label">Year</span>
                  </span>
                  <span className="program-shift">
                    {shiftIcons[program.shift] || <FiSun className="shift-icon" />}
                    {program.shift}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function SummaryCards({ classItem, studentsCount }) {
  const programRecords =
    Array.isArray(classItem.programs) && classItem.programs.length > 0
      ? classItem.programs
      : [{ major: classItem.major, year: classItem.year, shift: classItem.shift }];

  const studentRecords = Array.isArray(classItem.students) ? classItem.students : [];

  const majorSet = new Set();
  const yearSet = new Set();
  const shiftSet = new Set();

  const collectTotals = (major, year, shift) => {
    if (major) majorSet.add(major);
    if (year) yearSet.add(year);
    if (shift) shiftSet.add(shift);
  };

  programRecords.forEach((item) => collectTotals(item.major, item.year, item.shift));
  studentRecords.forEach((student) => collectTotals(student.major, student.year, student.shift));

  // Preserve one value for each category when records are empty.
  collectTotals(classItem.major, classItem.year, classItem.shift);

  const cards = [
    { label: "Total Students", value: studentsCount },
    { label: "Total Subjects", value: Array.isArray(classItem.subjects) ? classItem.subjects.length : 0 },
    { label: "Total major", value: majorSet.size },
    { label: "Total year", value: yearSet.size },
    { label: "Totall shift", value: shiftSet.size }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
