import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { message } from "antd";
import { useLanguage } from "../i18n/LanguageContext";
import { ClassCard } from "../components/Cards";
import Modal from "../components/Modal";

const DEFAULT_YEAR_OPTIONS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const DEFAULT_SHIFT_OPTIONS = ["Morning", "Evening", "Sunday-Saturday"];
const MAX_PROGRAMS_PER_CLASS = 4;
const CUSTOM_SUBJECT_OPTION = "__custom_subject__";

function getClassPrograms(classItem) {
  if (Array.isArray(classItem.programs) && classItem.programs.length > 0) {
    return classItem.programs;
  }

  return [{ major: classItem.major, year: classItem.year, shift: classItem.shift }];
}

function ClassList({ classes, onCreateClass }) {
  const navigate = useNavigate();
  const { isDark } = useOutletContext();
  const { t, lang } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [draftClassName, setDraftClassName] = useState("");
  const [selectedSubjectOption, setSelectedSubjectOption] = useState("");
  const [customSubjectName, setCustomSubjectName] = useState("");
  const [draftPrograms, setDraftPrograms] = useState([
    {
      major: "",
      year: DEFAULT_YEAR_OPTIONS[0],
      shift: DEFAULT_SHIFT_OPTIONS[0]
    }
  ]);

  const brandBlue = isDark ? "#93c5fd" : "#1d4ed8";
  const normalizedSearchText = searchText.trim().toLowerCase();

  const classOptions = useMemo(() => {
    const majorSet = new Set();
    const yearSet = new Set();
    const shiftSet = new Set();
    const subjectSet = new Set();

    classes.forEach((classItem) => {
      getClassPrograms(classItem).forEach((program) => {
        if (program.major) majorSet.add(program.major);
        if (program.year) yearSet.add(program.year);
        if (program.shift) shiftSet.add(program.shift);
      });

      if (Array.isArray(classItem.subjects)) {
        classItem.subjects.forEach((subject) => {
          const normalizedSubject = String(subject || "").trim();
          if (normalizedSubject) {
            subjectSet.add(normalizedSubject);
          }
        });
      }
    });

    return {
      majorOptions: [...majorSet].sort((a, b) => a.localeCompare(b)),
      yearOptions: [...yearSet].sort((a, b) => a.localeCompare(b)),
      shiftOptions: [...shiftSet].sort((a, b) => a.localeCompare(b)),
      subjectOptions: [...subjectSet].sort((a, b) => a.localeCompare(b))
    };
  }, [classes]);

  const createFormOptions = useMemo(() => {
    return {
      majorOptions: classOptions.majorOptions,
      yearOptions: classOptions.yearOptions.length > 0 ? classOptions.yearOptions : DEFAULT_YEAR_OPTIONS,
      shiftOptions: classOptions.shiftOptions.length > 0 ? classOptions.shiftOptions : DEFAULT_SHIFT_OPTIONS,
      subjectOptions: classOptions.subjectOptions
    };
  }, [classOptions]);

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

  const getEmptyProgramDraft = () => ({
    major: createFormOptions.majorOptions[0] || "",
    year: createFormOptions.yearOptions[0] || DEFAULT_YEAR_OPTIONS[0],
    shift: createFormOptions.shiftOptions[0] || DEFAULT_SHIFT_OPTIONS[0]
  });

  const openCreateModal = () => {
    setDraftClassName("");
    setSelectedSubjectOption("");
    setCustomSubjectName("");
    setDraftPrograms([getEmptyProgramDraft()]);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const updateProgramField = (index, field, value) => {
    setDraftPrograms((prev) =>
      prev.map((program, programIndex) => (programIndex === index ? { ...program, [field]: value } : program))
    );
  };

  const handleCreateClass = () => {
    if (typeof onCreateClass !== "function") {
      message.error("Create class is not available.");
      return;
    }

    const normalizedClassName = draftClassName.trim();
    if (!normalizedClassName) {
      message.warning("Class name is required.");
      return;
    }

    const classNameKey = normalizedClassName.toLowerCase();
    const classNameExists = classes.some(
      (classItem) => String(classItem.name || "").trim().toLowerCase() === classNameKey
    );

    if (classNameExists) {
      message.warning("Class name already exists.");
      return;
    }

    const normalizedPrograms = draftPrograms.map((program) => ({
      major: String(program.major || "").trim(),
      year: String(program.year || "").trim(),
      shift: String(program.shift || "").trim()
    }));

    const hasIncompleteProgram = normalizedPrograms.some(
      (program) => !program.major || !program.year || !program.shift
    );

    if (hasIncompleteProgram) {
      message.warning("Please complete all major, year, and shift fields.");
      return;
    }

    const uniquePrograms = [];
    const majorKeySet = new Set();

    normalizedPrograms.forEach((program) => {
      const majorKey = program.major.toLowerCase();
      if (majorKeySet.has(majorKey)) {
        return;
      }
      majorKeySet.add(majorKey);
      uniquePrograms.push(program);
    });

    if (uniquePrograms.length > MAX_PROGRAMS_PER_CLASS) {
      message.warning("One class can have up to 4 shifts only.");
      return;
    }

    const normalizedSubject =
      selectedSubjectOption === CUSTOM_SUBJECT_OPTION
        ? customSubjectName.trim()
        : selectedSubjectOption.trim();

    const createdClass = onCreateClass({
      name: normalizedClassName,
      programs: uniquePrograms,
      subjects: normalizedSubject ? [normalizedSubject] : [],
      students: []
    });

    if (!createdClass) {
      message.error("Unable to create class.");
      return;
    }

    closeCreateModal();
    setSearchText(normalizedClassName);
    message.success(`Class ${normalizedClassName} created.`);
  };

  const modalInputClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-[#4ea1ff] focus:ring-2 focus:ring-[#4ea1ff]/30"
    : "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const modalSelectClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#4ea1ff] focus:ring-2 focus:ring-[#4ea1ff]/30"
    : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const modalLabelClass = isDark
    ? "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300"
    : "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";

  const addButtonClass = isDark
    ? "rounded-lg border border-blue-400 bg-transparent px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-900/30"
    : "rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50";

  return (
    <main className="min-h-screen bg-transparent py-8">
      <section className="w-full">
        <div className="-mt-[20px] flex flex-col gap-3 sm:relative sm:block">
          <div className="flex justify-end sm:absolute sm:right-0 sm:top-0">
            <button
              type="button"
              onClick={openCreateModal}
              className={addButtonClass}
            >
              {t("actions.addNew")} Class
            </button>
          </div>

          <h1
            className={`text-3xl ${
              lang === "km"
                ? "khmer-moul-light font-normal tracking-normal leading-[1.5]"
                : "font-black tracking-tight"
            }`}
            style={{ color: brandBlue, textAlign: "center" }}
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

      <Modal
        isOpen={isCreateModalOpen}
        title="Create Class"
        onClose={closeCreateModal}
        onConfirm={handleCreateClass}
        confirmText="Create"
        isDark={isDark}
      >
        <div className="space-y-4">
          <div>
            <label className={modalLabelClass}>Class Name</label>
            <input
              type="text"
              value={draftClassName}
              onChange={(event) => setDraftClassName(event.target.value)}
              placeholder="e.g. A20"
              className={modalInputClass}
            />
          </div>

          <div>
            <label className={modalLabelClass}>Programs</label>
            <div className="space-y-2">
              {draftPrograms.map((program, index) => (
                <div key={`program-row-${index}`} className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_120px_140px]">
                  <select
                    value={program.major}
                    onChange={(event) => updateProgramField(index, "major", event.target.value)}
                    className={modalSelectClass}
                  >
                    {createFormOptions.majorOptions.length === 0 ? (
                      <option value="">Select major</option>
                    ) : (
                      createFormOptions.majorOptions.map((majorOption) => (
                        <option key={`major-${majorOption}`} value={majorOption}>
                          {majorOption}
                        </option>
                      ))
                    )}
                  </select>

                  <select
                    value={program.year}
                    onChange={(event) => updateProgramField(index, "year", event.target.value)}
                    className={modalSelectClass}
                  >
                    {createFormOptions.yearOptions.map((yearOption) => (
                      <option key={`year-${yearOption}`} value={yearOption}>
                        {yearOption}
                      </option>
                    ))}
                  </select>

                  <select
                    value={program.shift}
                    onChange={(event) => updateProgramField(index, "shift", event.target.value)}
                    className={modalSelectClass}
                  >
                    {createFormOptions.shiftOptions.map((shiftOption) => (
                      <option key={`shift-${shiftOption}`} value={shiftOption}>
                        {shiftOption}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={modalLabelClass}>Subject</label>
            <div className="space-y-2">
              <select
                value={selectedSubjectOption}
                onChange={(event) => setSelectedSubjectOption(event.target.value)}
                className={modalSelectClass}
              >
                <option value="">Select subject</option>
                {createFormOptions.subjectOptions.map((subjectOption) => (
                  <option key={`subject-${subjectOption}`} value={subjectOption}>
                    {subjectOption}
                  </option>
                ))}
                <option value={CUSTOM_SUBJECT_OPTION}>Other (type text)</option>
              </select>

              {selectedSubjectOption === CUSTOM_SUBJECT_OPTION && (
                <input
                  type="text"
                  value={customSubjectName}
                  onChange={(event) => setCustomSubjectName(event.target.value)}
                  placeholder="Type subject"
                  className={modalInputClass}
                />
              )}
            </div>
          </div>

        </div>
      </Modal>
    </main>
  );
}

export default ClassList;
