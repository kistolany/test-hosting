import { useEffect, useRef } from "react";

function StudentTable({
  students,
  highlightStudentId,
  isDark = false,
  selectedStudentIds = [],
  onToggleStudent,
  onToggleAllVisible
}) {
  const tableShellClass = isDark
    ? "overflow-x-auto rounded-xl bg-[#001529] text-slate-100 shadow-sm ring-1 ring-[#1f3e6d]"
    : "overflow-x-auto rounded-xl bg-white text-slate-800 shadow-sm ring-1 ring-slate-200";

  const tableHeadClass = isDark ? "bg-[#2f4368] text-slate-100" : "bg-slate-100 text-slate-600";
  const selectAllRef = useRef(null);
  const hasSelectionControls = typeof onToggleStudent === "function" && typeof onToggleAllVisible === "function";
  const visibleSelectedCount = students.filter((student) => selectedStudentIds.includes(student.id)).length;
  const allVisibleSelected = students.length > 0 && visibleSelectedCount === students.length;
  const hasPartialVisibleSelection = visibleSelectedCount > 0 && !allVisibleSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = hasPartialVisibleSelection;
    }
  }, [hasPartialVisibleSelection]);

  return (
    <section className={tableShellClass}>
      <table className="w-full text-left text-[clamp(11px,0.85vw,14px)]">
        <thead className={tableHeadClass}>
          <tr>
            {hasSelectionControls && (
              <th className="w-[48px] px-3 py-2.5 md:px-4 md:py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => onToggleAllVisible(event.target.checked)}
                  aria-label="Select all visible students"
                  className="h-4 w-4 cursor-pointer"
                />
              </th>
            )}
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Student ID</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Name</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Gender</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">DOB</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Major</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Year</th>
            <th className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3">Shift</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={hasSelectionControls ? 8 : 7} className={`px-4 py-8 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const isHighlighted = highlightStudentId === student.id;
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <tr
                  id={`student-row-${student.id}`}
                  key={student.id}
                  className={`border-t border-slate-200 transition ${
                    isDark
                      ? (isHighlighted ? "border-[#2a4f84] bg-[#0b2b55]" : "border-[#2a4f84] bg-[#001f3a]")
                      : (isHighlighted ? "border-slate-200 bg-emerald-50" : "border-slate-200 bg-white")
                  }`}
                >
                  {hasSelectionControls && (
                    <td className="px-3 py-2.5 md:px-4 md:py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) => onToggleStudent(student.id, event.target.checked)}
                        aria-label={`Select ${student.name}`}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.id}</td>
                  <td className="px-3 py-2.5 md:px-4 md:py-3">{student.name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.gender}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.dob}</td>
                  <td className="px-3 py-2.5 md:px-4 md:py-3">{student.major}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 md:px-4 md:py-3">{student.year}</td>
                  <td className="px-3 py-2.5 md:px-4 md:py-3">{student.shift}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}

export default StudentTable;
