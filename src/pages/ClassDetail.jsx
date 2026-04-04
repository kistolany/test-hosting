import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select, message } from "antd";
import { useLanguage } from "../i18n/LanguageContext";
import { SummaryCards } from "../components/Cards";
import StudentTable from "../components/StudentTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

function playSuccessSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = 620;
  gainNode.gain.value = 0.06;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
}

const PROGRAM_YEAR_OPTIONS = ["Year 1", "Year 2", "Year 3", "Year 4"];
const PROGRAM_SHIFT_OPTIONS = ["Morning", "Evening", "Sunday-Saturday"];
const MAX_PROGRAMS_PER_CLASS = 4;

function ClassDetail({ classes, onUpdateClass }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const outlet = useOutletContext();
  const isDark = Boolean(outlet?.isDark);
  const [searchParams] = useSearchParams();

  const classItem = classes.find((item) => item.id === Number(id));
  const [students, setStudents] = useState(classItem?.students ?? []);
  const [studentSearchText, setStudentSearchText] = useState("");
  const [selectedStudentMajor, setSelectedStudentMajor] = useState("All");
  const [selectedStudentYear, setSelectedStudentYear] = useState("All");
  const [selectedStudentShift, setSelectedStudentShift] = useState("All");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isEnrollModalOpen, setEnrollModalOpen] = useState(false);
  const [targetClassId, setTargetClassId] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const [classForm, setClassForm] = useState({
    major: classItem?.major ?? "",
    year: classItem?.year ?? "",
    shift: classItem?.shift ?? ""
  });
  const [isProgramModalOpen, setProgramModalOpen] = useState(false);
  const [programModalMode, setProgramModalMode] = useState("add");
  const [editingProgramIndex, setEditingProgramIndex] = useState(null);
  const [programDraft, setProgramDraft] = useState({
    major: "",
    year: PROGRAM_YEAR_OPTIONS[0],
    shift: PROGRAM_SHIFT_OPTIONS[0]
  });
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState("add");
  const [editingSubjectIndex, setEditingSubjectIndex] = useState(null);
  const [subjectDraft, setSubjectDraft] = useState("");

  const [highlightStudentId, setHighlightStudentId] = useState(searchParams.get("highlight") || "");

  const classPrograms = useMemo(() => {
    if (!classItem) return [];
    if (Array.isArray(classItem.programs) && classItem.programs.length > 0) {
      return classItem.programs;
    }
    return [
      {
        major: classItem.major || "General",
        year: classItem.year || "Year 1",
        shift: classItem.shift || "Morning"
      }
    ];
  }, [classItem]);

  const defaultProgram = classPrograms[0] || { major: "General", year: "Year 1", shift: "Morning" };

  useEffect(() => {
    if (!classItem) return;
    const normalizedStudents = (classItem.students || []).map((student) => ({
      ...student,
      major: student.major || defaultProgram.major,
      year: student.year || defaultProgram.year,
      shift: student.shift || defaultProgram.shift
    }));
    setStudents(normalizedStudents);
    setClassForm({ major: classItem.major, year: classItem.year, shift: classItem.shift });
  }, [classItem?.id]);

  useEffect(() => {
    if (!classItem) return;
    const current = JSON.stringify(classItem.students || []);
    const next = JSON.stringify(students || []);
    if (current === next) return;
    onUpdateClass(classItem.id, { students });
  }, [students, classItem, onUpdateClass]);

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast({ show: false, message: "" }), 1900);
    return () => clearTimeout(timer);
  }, [toast.show]);

  useEffect(() => {
    if (!highlightStudentId) return;
    const row = document.getElementById(`student-row-${highlightStudentId}`);
    if (!row) return;
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setHighlightStudentId(""), 2500);
    return () => clearTimeout(timer);
  }, [highlightStudentId, students]);

  useEffect(() => {
    setSelectedStudentIds((prev) => prev.filter((idValue) => students.some((student) => student.id === idValue)));
  }, [students]);

  if (!classItem) {
    return (
      <main className={`grid min-h-screen place-items-center px-4 ${isDark ? "bg-transparent" : "bg-slate-100"}`}>
        <div className={`rounded-xl p-6 text-center shadow-sm ${isDark ? "bg-[#001529] ring-1 ring-[#1f3e6d]" : "bg-white"}`}>
          <p className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>Class not found.</p>
          <button
            type="button"
            onClick={() => navigate("/classes")}
            className={`mt-3 rounded-lg px-4 py-2 text-white ${isDark ? "bg-[#123b73] hover:bg-[#1a4d96]" : "bg-slate-900"}`}
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const openDeleteModal = (student) => {
    setPendingDelete(student);
    setDeleteModalOpen(true);
  };

  const showSuccess = (message) => {
    setToast({ show: true, message });
    playSuccessSound();
  };

  const saveInlineEdit = (studentId, draft) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, ...draft } : student))
    );
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setStudents((prev) => prev.filter((student) => student.id !== pendingDelete.id));
    setDeleteModalOpen(false);
    setPendingDelete(null);
    showSuccess("Student deleted");
  };

  const saveClassEdit = () => {
    onUpdateClass(classItem.id, classForm);
    setClassModalOpen(false);
    showSuccess("Class updated");
  };

  const toggleStudentSelection = (studentId, isChecked) => {
    setSelectedStudentIds((prev) => {
      if (isChecked) {
        if (prev.includes(studentId)) return prev;
        return [...prev, studentId];
      }
      return prev.filter((idValue) => idValue !== studentId);
    });
  };

  const toggleAllVisibleStudents = (isChecked, visibleIds) => {
    setSelectedStudentIds((prev) => {
      if (isChecked) {
        return [...new Set([...prev, ...visibleIds])];
      }
      return prev.filter((idValue) => !visibleIds.includes(idValue));
    });
  };

  const programList =
    Array.isArray(classItem.programs) && classItem.programs.length > 0
      ? classItem.programs
      : classPrograms;

  const allClassProgramOptions = useMemo(() => {
    const majors = new Set();
    const years = new Set(PROGRAM_YEAR_OPTIONS);
    const shifts = new Set(PROGRAM_SHIFT_OPTIONS);

    classes.forEach((classRecord) => {
      const classProgramsSource =
        Array.isArray(classRecord.programs) && classRecord.programs.length > 0
          ? classRecord.programs
          : [{ major: classRecord.major, year: classRecord.year, shift: classRecord.shift }];

      classProgramsSource.forEach((program) => {
        const major = program.major?.trim();
        const year = program.year?.trim();
        const shift = program.shift?.trim();

        if (major) majors.add(major);
        if (year) years.add(year);
        if (shift) shifts.add(shift);
      });
    });

    return {
      majors: [...majors].sort((a, b) => a.localeCompare(b)),
      years: [...years].sort((a, b) => a.localeCompare(b)),
      shifts: [...shifts].sort((a, b) => a.localeCompare(b)),
    };
  }, [classes]);

  const getDefaultProgramDraft = () => ({
    major: allClassProgramOptions.majors[0] || "",
    year: allClassProgramOptions.years[0] || PROGRAM_YEAR_OPTIONS[0],
    shift: allClassProgramOptions.shifts[0] || PROGRAM_SHIFT_OPTIONS[0],
  });

  const subjectList = Array.isArray(classItem.subjects) ? classItem.subjects : [];

  const allClassSubjectOptions = useMemo(() => {
    const subjects = new Set();

    classes.forEach((classRecord) => {
      const classSubjects = Array.isArray(classRecord.subjects) ? classRecord.subjects : [];
      classSubjects.forEach((subject) => {
        const normalized = subject?.trim();
        if (normalized) subjects.add(normalized);
      });
    });

    return [...subjects].sort((a, b) => a.localeCompare(b));
  }, [classes]);

  const subjectSelectOptions = useMemo(() => {
    const currentSubject = subjectDraft.trim();
    return [...new Set([...allClassSubjectOptions, currentSubject].filter(Boolean))];
  }, [allClassSubjectOptions, subjectDraft]);

  const getDefaultSubjectDraft = () => allClassSubjectOptions[0] || "";

  const deleteProgram = (indexToDelete) => {
    if (programList.length <= 1) return;

    const nextPrograms = programList.filter((_, index) => index !== indexToDelete);
    const firstProgram = nextPrograms[0] || { major: classItem.major, year: classItem.year, shift: classItem.shift };

    onUpdateClass(classItem.id, {
      programs: nextPrograms,
      major: firstProgram.major,
      year: firstProgram.year,
      shift: firstProgram.shift
    });

    showSuccess("Program deleted");
  };

  const closeProgramModal = () => {
    setProgramModalOpen(false);
    setProgramModalMode("add");
    setEditingProgramIndex(null);
    setProgramDraft(getDefaultProgramDraft());
  };

  const editProgram = (indexToEdit) => {
    const currentProgram = programList[indexToEdit] || { major: "", year: "", shift: "" };
    setProgramModalMode("edit");
    setEditingProgramIndex(indexToEdit);
    setProgramDraft({
      major: currentProgram.major || "",
      year: currentProgram.year || PROGRAM_YEAR_OPTIONS[0],
      shift: currentProgram.shift || PROGRAM_SHIFT_OPTIONS[0]
    });
    setProgramModalOpen(true);
  };

  const addProgram = () => {
    if (programList.length >= MAX_PROGRAMS_PER_CLASS) {
      message.warning("One class can have up to 4 shifts only.");
      return;
    }

    setProgramModalMode("add");
    setEditingProgramIndex(null);
    setProgramDraft(getDefaultProgramDraft());
    setProgramModalOpen(true);
  };

  const closeSubjectModal = () => {
    setSubjectModalOpen(false);
    setSubjectModalMode("add");
    setEditingSubjectIndex(null);
    setSubjectDraft("");
  };

  const saveProgram = () => {
    const trimmedMajor = programDraft.major.trim();
    const trimmedYear = programDraft.year.trim();
    const trimmedShift = programDraft.shift.trim();

    if (!trimmedMajor || !trimmedYear || !trimmedShift) return;

    let nextPrograms = [];

    if (programModalMode === "edit" && editingProgramIndex !== null) {
      nextPrograms = programList.map((program, index) => (
        index === editingProgramIndex
          ? { major: trimmedMajor, year: trimmedYear, shift: trimmedShift }
          : program
      ));
    } else {
      if (programList.length >= MAX_PROGRAMS_PER_CLASS) {
        message.warning("One class can have up to 4 shifts only.");
        return;
      }

      nextPrograms = [
        ...programList,
        {
          major: trimmedMajor,
          year: trimmedYear,
          shift: trimmedShift
        }
      ];
    }

    const firstProgram = nextPrograms[0];

    onUpdateClass(classItem.id, {
      programs: nextPrograms,
      major: firstProgram.major,
      year: firstProgram.year,
      shift: firstProgram.shift
    });

    closeProgramModal();
    showSuccess(programModalMode === "edit" ? "Program updated" : "Program added");
  };

  const editSubject = (indexToEdit) => {
    const currentName = subjectList[indexToEdit] || "";
    setSubjectModalMode("edit");
    setEditingSubjectIndex(indexToEdit);
    setSubjectDraft(currentName);
    setSubjectModalOpen(true);
  };

  const deleteSubject = (indexToDelete) => {
    const nextSubjects = subjectList.filter((_, index) => index !== indexToDelete);
    onUpdateClass(classItem.id, { subjects: nextSubjects });
    showSuccess("Subject deleted");
  };

  const addSubject = () => {
    setSubjectModalMode("add");
    setEditingSubjectIndex(null);
    setSubjectDraft(getDefaultSubjectDraft());
    setSubjectModalOpen(true);
  };

  const saveSubject = () => {
    const trimmedName = subjectDraft.trim();
    if (!trimmedName) return;

    if (subjectModalMode === "edit" && editingSubjectIndex !== null) {
      const currentName = subjectList[editingSubjectIndex] || "";
      if (trimmedName === currentName) {
        closeSubjectModal();
        return;
      }

      const nextSubjects = subjectList.map((subject, index) => (
        index === editingSubjectIndex ? trimmedName : subject
      ));

      onUpdateClass(classItem.id, { subjects: nextSubjects });
      closeSubjectModal();
      showSuccess("Subject updated");
      return;
    }

    onUpdateClass(classItem.id, { subjects: [...subjectList, trimmedName] });
    closeSubjectModal();
    showSuccess("Subject added");
  };

  const availableTargetClasses = classes
    .filter((classRecord) => classRecord.id !== classItem.id)
    .sort((a, b) => Number(a.id) - Number(b.id));

  const selectedStudents = students.filter((student) => selectedStudentIds.includes(student.id));

  const openEnrollModal = () => {
    if (selectedStudentIds.length === 0) return;

    if (!targetClassId && availableTargetClasses.length > 0) {
      setTargetClassId(availableTargetClasses[0].id);
    }

    setEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setEnrollModalOpen(false);
  };

  const confirmEnrollStudents = () => {
    if (!targetClassId) return;

    const targetClass = classes.find((classRecord) => classRecord.id === targetClassId);
    if (!targetClass || selectedStudents.length === 0) return;

    const nextCurrentStudents = students.filter((student) => !selectedStudentIds.includes(student.id));

    const targetPrograms =
      Array.isArray(targetClass.programs) && targetClass.programs.length > 0
        ? targetClass.programs
        : [{ major: targetClass.major, year: targetClass.year, shift: targetClass.shift }];

    const targetFallbackProgram = targetPrograms[0] || { major: "General", year: "Year 1", shift: "Morning" };
    const createMajorKey = (major) => `${major || ""}`.trim().toLowerCase();
    const nextTargetPrograms = targetPrograms.map((program) => ({
      major: program.major || targetFallbackProgram.major,
      year: program.year || targetFallbackProgram.year,
      shift: program.shift || targetFallbackProgram.shift,
    }));
    const targetMajorKeySet = new Set(nextTargetPrograms.map((program) => createMajorKey(program.major)).filter(Boolean));

    const targetCurrentStudents = Array.isArray(targetClass.students) ? targetClass.students : [];
    const mergedStudentMap = new Map(targetCurrentStudents.map((student) => [student.id, student]));

    selectedStudents.forEach((student) => {
      const normalizedStudent = {
        ...student,
        major: student.major || targetFallbackProgram.major,
        year: student.year || targetFallbackProgram.year,
        shift: student.shift || targetFallbackProgram.shift,
      };
      mergedStudentMap.set(normalizedStudent.id, normalizedStudent);

      const incomingProgram = {
        major: normalizedStudent.major,
        year: normalizedStudent.year,
        shift: normalizedStudent.shift,
      };
      const incomingMajorKey = createMajorKey(incomingProgram.major);

      if (
        incomingMajorKey
        && !targetMajorKeySet.has(incomingMajorKey)
        && nextTargetPrograms.length < MAX_PROGRAMS_PER_CLASS
      ) {
        targetMajorKeySet.add(incomingMajorKey);
        nextTargetPrograms.push(incomingProgram);
      }
    });

    const firstTargetProgram = nextTargetPrograms[0] || targetFallbackProgram;

    setStudents(nextCurrentStudents);
    onUpdateClass(targetClass.id, {
      students: [...mergedStudentMap.values()],
      programs: nextTargetPrograms,
      major: firstTargetProgram.major,
      year: firstTargetProgram.year,
      shift: firstTargetProgram.shift,
    });

    setSelectedStudentIds([]);
    setEnrollModalOpen(false);

    const studentLabel = selectedStudents.length === 1 ? "student" : "students";
    const successMessage = `Moved ${selectedStudents.length} ${studentLabel} to Class ${targetClass.name}`;
    showSuccess(successMessage);
    message.success(successMessage);
  };

  const studentFilterOptions = useMemo(() => {
    const majorSet = new Set();
    const yearSet = new Set();
    const shiftSet = new Set();

    students.forEach((student) => {
      if (student.major) majorSet.add(student.major);
      if (student.year) yearSet.add(student.year);
      if (student.shift) shiftSet.add(student.shift);
    });

    return {
      majors: [...majorSet].sort((a, b) => a.localeCompare(b)),
      years: [...yearSet].sort((a, b) => a.localeCompare(b)),
      shifts: [...shiftSet].sort((a, b) => a.localeCompare(b))
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalizedSearchText = studentSearchText.trim().toLowerCase();

    return students.filter((student) => {
      const majorMatch = selectedStudentMajor === "All" || student.major === selectedStudentMajor;
      const yearMatch = selectedStudentYear === "All" || student.year === selectedStudentYear;
      const shiftMatch = selectedStudentShift === "All" || student.shift === selectedStudentShift;

      if (!majorMatch || !yearMatch || !shiftMatch) {
        return false;
      }

      if (!normalizedSearchText) {
        return true;
      }

      const searchableParts = [
        student.id,
        student.name,
        student.gender,
        student.dob,
        student.major,
        student.year,
        student.shift
      ];

      return searchableParts
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchText);
    });
  }, [students, studentSearchText, selectedStudentMajor, selectedStudentYear, selectedStudentShift]);

  const clearStudentFilters = () => {
    setStudentSearchText("");
    setSelectedStudentMajor("All");
    setSelectedStudentYear("All");
    setSelectedStudentShift("All");
  };

  const surfaceCardClass = isDark
    ? "w-full rounded-2xl bg-[#001529] p-4 shadow-sm ring-1 ring-[#1f3e6d]"
    : "w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200";

  const sectionTitleClass = isDark ? "text-sm font-semibold text-blue-300" : "text-sm font-semibold text-blue-700";

  const gridHeaderClass = isDark
    ? "grid grid-cols-[minmax(0,1fr)_74px_90px_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
    : "grid grid-cols-[minmax(0,1fr)_74px_90px_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500";

  const subjectHeaderClass = isDark
    ? "grid grid-cols-[1fr_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
    : "grid grid-cols-[1fr_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500";

  const itemRowClass = isDark
    ? "grid grid-cols-[minmax(0,1fr)_74px_90px_64px] items-center gap-x-2 rounded-xl border border-[#2a4f84] bg-[#001f3a] px-3 py-2 text-xs font-medium text-slate-100"
    : "grid grid-cols-[minmax(0,1fr)_74px_90px_64px] items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700";

  const subjectRowClass = isDark
    ? "grid grid-cols-[1fr_64px] items-center gap-x-2 rounded-xl border border-[#2a4f84] bg-[#001f3a] px-3 py-2 text-xs font-medium text-slate-100"
    : "grid grid-cols-[1fr_64px] items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700";

  const emptyTextClass = isDark ? "px-3 py-2 text-xs text-slate-400" : "px-3 py-2 text-xs text-slate-500";

  const newButtonClass = isDark
    ? "rounded-lg border border-blue-400 bg-transparent px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-900/30"
    : "rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50";

  const filterPanelClass = isDark
    ? "mb-3 rounded-xl bg-[#001529] p-3 shadow-sm ring-1 ring-[#1f3e6d]"
    : "mb-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200";

  const filterInputClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm text-slate-100 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] outline-none transition placeholder:text-slate-400 focus:border-[#4ea1ff] focus:ring-2 focus:ring-[#4ea1ff]/30"
    : "w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const filterSelectClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm text-slate-100 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.9)] outline-none transition focus:border-[#4ea1ff] focus:ring-2 focus:ring-[#4ea1ff]/30"
    : "w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const filterClearClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm font-semibold text-slate-100 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.95)] transition hover:bg-[#0d2b52]"
    : "w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm font-semibold text-blue-800 shadow-[0_14px_26px_-16px_rgba(30,64,175,0.55)] transition hover:bg-transparent hover:shadow-[0_18px_32px_-18px_rgba(30,64,175,0.6)]";

  const enrollButtonClass = isDark
    ? "rounded-lg border border-[#2f548a] bg-[#123b73] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a4d96] disabled:cursor-not-allowed disabled:opacity-60"
    : "rounded-lg border border-blue-300 bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60";

  const rowEditBtnClass = isDark
    ? "rounded-md p-1 text-blue-300 transition hover:bg-blue-900/30"
    : "rounded-md p-1 text-blue-600 transition hover:bg-blue-50";

  const rowDeleteBtnClass = isDark
    ? "rounded-md p-1 text-rose-300 transition hover:bg-rose-900/30"
    : "rounded-md p-1 text-rose-600 transition hover:bg-rose-50";

  const backButtonClass = isDark
    ? "inline-flex items-center gap-2 rounded-xl border border-[#2f548a] bg-[#001f3a] px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-[#0d2b52]"
    : "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50";

  const pageTitleClass = isDark
    ? "pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-300"
    : "pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-700";

  const searchableSelectProps = {
    showSearch: true,
    optionFilterProp: "label",
    filterOption: (input, option) => `${option?.label ?? ""}`.toLowerCase().includes(input.toLowerCase()),
    className: "w-full",
  };

  const modalInputClass = isDark
    ? "w-full rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-[#4ea1ff] focus:ring-2 focus:ring-[#4ea1ff]/30"
    : "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const modalLabelClass = isDark
    ? "block text-xs font-semibold uppercase tracking-wide text-slate-300"
    : "block text-xs font-semibold uppercase tracking-wide text-slate-600";

  const modalBodyTextClass = isDark ? "text-sm text-slate-300" : "text-sm text-slate-600";

  const classChoiceButtonClass = (isActive) => {
    if (isActive) {
      return isDark
        ? "rounded-lg border border-blue-300 bg-[#123b73] px-3 py-2 text-sm font-semibold text-white"
        : "rounded-lg border border-[#f3a5b3] bg-[#fdf0f2] px-3 py-2 text-sm font-semibold text-[#c13f5b]";
    }

    return isDark
      ? "rounded-lg border border-[#2f548a] bg-[#001f3a] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-[#0d2b52]"
      : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[#2d5da5] transition hover:bg-slate-50";
  };

  const majorAndSubjectCards = (
    <div className="flex w-full flex-col gap-4">
      <div className={surfaceCardClass}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className={sectionTitleClass}>Majors</h3>
          <button
            type="button"
            onClick={addProgram}
            disabled={programList.length >= MAX_PROGRAMS_PER_CLASS}
            className={`${newButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            New
          </button>
        </div>
        <div className="space-y-2">
          <div className={gridHeaderClass}>
            <span>Name</span>
            <span>Year</span>
            <span>Shift</span>
            <span className="text-center">Action</span>
          </div>

          {programList.length === 0 ? (
            <div className={emptyTextClass}>No majors</div>
          ) : (
            programList.map((program, index) => (
              <div
                key={`${program.major || "major"}-${program.year || "year"}-${program.shift || "shift"}-${index}`}
                className={itemRowClass}
              >
                <span className="break-words pr-2 leading-snug">{program.major || "-"}</span>
                <span className="truncate">{program.year || "-"}</span>
                <span className="truncate">{program.shift || "-"}</span>
                <div className="flex w-[64px] items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => editProgram(index)}
                    className={rowEditBtnClass}
                    aria-label="Edit major"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProgram(index)}
                    className={rowDeleteBtnClass}
                    aria-label="Delete major"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={surfaceCardClass}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className={sectionTitleClass}>Subjects</h3>
          <button
            type="button"
            onClick={addSubject}
            className={newButtonClass}
          >
            New
          </button>
        </div>
        <div className="space-y-2">
          <div className={subjectHeaderClass}>
            <span>Name</span>
            <span className="text-center">Action</span>
          </div>

          <div className="max-h-[412px] overflow-y-auto pr-1">
            {subjectList.length === 0 ? (
              <div className={emptyTextClass}>No subjects</div>
            ) : (
              <div className="space-y-2">
                {subjectList.map((subject, index) => (
                  <div
                    key={`${subject}-${index}`}
                    className={subjectRowClass}
                  >
                    <span className="break-words pr-2 leading-snug">{subject}</span>
                    <div className="flex w-[64px] items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => editSubject(index)}
                        className={rowEditBtnClass}
                        aria-label="Edit subject"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSubject(index)}
                        className={rowDeleteBtnClass}
                        aria-label="Delete subject"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-transparent py-6">
      <div className="flex w-full flex-col gap-5">
        <div className="relative mb-[15px] flex min-h-[40px] items-center">
          <button
            type="button"
            onClick={() => navigate("/classes")}
            className={backButtonClass}
          >
            <ArrowLeftOutlined />
            <span>{t("actions.back")}</span>
          </button>
          <h1 className={pageTitleClass}>
            Class {classItem.name}
          </h1>
        </div>

        <SummaryCards classItem={{ ...classItem, ...classForm }} studentsCount={students.length} isDark={isDark} />

        <section className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <section className={filterPanelClass}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <input
                  type="text"
                  value={studentSearchText}
                  onChange={(event) => setStudentSearchText(event.target.value)}
                  placeholder="Search by ID, name, major, year, or shift..."
                  className={filterInputClass}
                />

                <select
                  value={selectedStudentMajor}
                  onChange={(event) => setSelectedStudentMajor(event.target.value)}
                  className={filterSelectClass}
                >
                  <option value="All">All majors</option>
                  {studentFilterOptions.majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStudentYear}
                  onChange={(event) => setSelectedStudentYear(event.target.value)}
                  className={filterSelectClass}
                >
                  <option value="All">All years</option>
                  {studentFilterOptions.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStudentShift}
                  onChange={(event) => setSelectedStudentShift(event.target.value)}
                  className={filterSelectClass}
                >
                  <option value="All">All shifts</option>
                  {studentFilterOptions.shifts.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={clearStudentFilters}
                  className={filterClearClass}
                >
                  Clear
                </button>
              </div>

            </section>

            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={openEnrollModal}
                className={`${enrollButtonClass} min-w-[170px]`}
                disabled={selectedStudentIds.length === 0}
              >
                Enroll ({selectedStudentIds.length})
              </button>
            </div>

            <StudentTable
              students={filteredStudents}
              highlightStudentId={highlightStudentId}
              isDark={isDark}
              selectedStudentIds={selectedStudentIds}
              onToggleStudent={toggleStudentSelection}
              onToggleAllVisible={(isChecked) => toggleAllVisibleStudents(isChecked, filteredStudents.map((student) => student.id))}
              onSaveInline={saveInlineEdit}
              onDeleteRequest={openDeleteModal}
            />
          </div>
          <aside className="w-full lg:w-[460px] lg:min-w-[460px]">
            {majorAndSubjectCards}
          </aside>
        </section>
      </div>

      <Modal
        isOpen={isClassModalOpen}
        title="Edit Class Info"
        onClose={() => setClassModalOpen(false)}
        onConfirm={saveClassEdit}
        isDark={isDark}
      >
        <div className="space-y-3">
          <input
            value={classForm.major}
            onChange={(event) => setClassForm((prev) => ({ ...prev, major: event.target.value }))}
            placeholder="Major"
            className={modalInputClass}
          />
          <input
            value={classForm.year}
            onChange={(event) => setClassForm((prev) => ({ ...prev, year: event.target.value }))}
            placeholder="Year"
            className={modalInputClass}
          />
          <input
            value={classForm.shift}
            onChange={(event) => setClassForm((prev) => ({ ...prev, shift: event.target.value }))}
            placeholder="Shift"
            className={modalInputClass}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Student"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        isDark={isDark}
      >
        <p className={modalBodyTextClass}>
          Are you sure you want to delete {pendingDelete?.name}? This action cannot be undone.
        </p>
      </Modal>

      <Modal
        isOpen={isProgramModalOpen}
        title={programModalMode === "edit" ? "Edit Major" : "Add Major"}
        onClose={closeProgramModal}
        onConfirm={saveProgram}
        confirmText={programModalMode === "edit" ? "Update" : "Add"}
        isDark={isDark}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className={modalLabelClass}>
              Major Name
            </label>
            <Select
              value={programDraft.major || undefined}
              onChange={(value) => setProgramDraft((prev) => ({ ...prev, major: value }))}
              options={allClassProgramOptions.majors.map((majorOption) => ({ label: majorOption, value: majorOption }))}
              placeholder="Select major"
              {...searchableSelectProps}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={modalLabelClass}>
                Year
              </label>
              <Select
                value={programDraft.year || undefined}
                onChange={(value) => setProgramDraft((prev) => ({ ...prev, year: value }))}
                options={allClassProgramOptions.years.map((yearOption) => ({ label: yearOption, value: yearOption }))}
                placeholder="Select year"
                {...searchableSelectProps}
              />
            </div>

            <div className="space-y-1">
              <label className={modalLabelClass}>
                Shift
              </label>
              <Select
                value={programDraft.shift || undefined}
                onChange={(value) => setProgramDraft((prev) => ({ ...prev, shift: value }))}
                options={allClassProgramOptions.shifts.map((shiftOption) => ({ label: shiftOption, value: shiftOption }))}
                placeholder="Select shift"
                {...searchableSelectProps}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSubjectModalOpen}
        title={subjectModalMode === "edit" ? "Edit Subject" : "Add Subject"}
        onClose={closeSubjectModal}
        onConfirm={saveSubject}
        confirmText={subjectModalMode === "edit" ? "Update" : "Add"}
        isDark={isDark}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label className={modalLabelClass}>
              Subject Name
            </label>
            <Select
              value={subjectDraft || undefined}
              onChange={(value) => setSubjectDraft(value)}
              options={subjectSelectOptions.map((subjectOption) => ({ label: subjectOption, value: subjectOption }))}
              placeholder="Select subject"
              {...searchableSelectProps}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEnrollModalOpen}
        title="Enroll Selected Students"
        onClose={closeEnrollModal}
        onConfirm={confirmEnrollStudents}
        confirmText="Enroll"
        isDark={isDark}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableTargetClasses.map((targetClass) => (
              <button
                key={targetClass.id}
                type="button"
                onClick={() => setTargetClassId(targetClass.id)}
                className={classChoiceButtonClass(targetClassId === targetClass.id)}
              >
                {targetClass.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Toast show={toast.show} message={toast.message} />
    </main>
  );
}

export default ClassDetail;
