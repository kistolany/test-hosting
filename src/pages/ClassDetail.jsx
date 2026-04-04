import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

function ClassDetail({ classes, onUpdateClass }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const classItem = classes.find((item) => item.id === Number(id));
  const [students, setStudents] = useState(classItem?.students ?? []);
  const [studentSearchText, setStudentSearchText] = useState("");
  const [selectedStudentMajor, setSelectedStudentMajor] = useState("All");
  const [selectedStudentYear, setSelectedStudentYear] = useState("All");
  const [selectedStudentShift, setSelectedStudentShift] = useState("All");

  const [toast, setToast] = useState({ show: false, message: "" });
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const [classForm, setClassForm] = useState({
    major: classItem?.major ?? "",
    year: classItem?.year ?? "",
    shift: classItem?.shift ?? ""
  });

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

  if (!classItem) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="font-semibold text-slate-900">Class not found.</p>
          <button
            type="button"
            onClick={() => navigate("/classes")}
            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white"
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

  const programList =
    Array.isArray(classItem.programs) && classItem.programs.length > 0
      ? classItem.programs
      : classPrograms;

  const subjectList = Array.isArray(classItem.subjects) ? classItem.subjects : [];

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

  const editProgram = (indexToEdit) => {
    const currentProgram = programList[indexToEdit] || { major: "", year: "", shift: "" };

    const nextMajor = window.prompt("Edit major name", currentProgram.major || "");
    if (nextMajor === null) return;

    const nextYear = window.prompt("Edit year", currentProgram.year || "");
    if (nextYear === null) return;

    const nextShift = window.prompt("Edit shift", currentProgram.shift || "");
    if (nextShift === null) return;

    const trimmedMajor = nextMajor.trim();
    const trimmedYear = nextYear.trim();
    const trimmedShift = nextShift.trim();

    if (!trimmedMajor || !trimmedYear || !trimmedShift) return;

    const nextPrograms = programList.map((program, index) => (
      index === indexToEdit
        ? { major: trimmedMajor, year: trimmedYear, shift: trimmedShift }
        : program
    ));

    const firstProgram = nextPrograms[0];

    onUpdateClass(classItem.id, {
      programs: nextPrograms,
      major: firstProgram.major,
      year: firstProgram.year,
      shift: firstProgram.shift
    });

    showSuccess("Program updated");
  };

  const addProgram = () => {
    const nextMajor = window.prompt("New major name", "");
    if (nextMajor === null) return;

    const nextYear = window.prompt("New year", "Year 1");
    if (nextYear === null) return;

    const nextShift = window.prompt("New shift", "Morning");
    if (nextShift === null) return;

    const trimmedMajor = nextMajor.trim();
    const trimmedYear = nextYear.trim();
    const trimmedShift = nextShift.trim();

    if (!trimmedMajor || !trimmedYear || !trimmedShift) return;

    const nextPrograms = [
      ...programList,
      {
        major: trimmedMajor,
        year: trimmedYear,
        shift: trimmedShift
      }
    ];

    const firstProgram = nextPrograms[0];

    onUpdateClass(classItem.id, {
      programs: nextPrograms,
      major: firstProgram.major,
      year: firstProgram.year,
      shift: firstProgram.shift
    });

    showSuccess("Program added");
  };

  const editSubject = (indexToEdit) => {
    const currentName = subjectList[indexToEdit] || "";
    const nextName = window.prompt("Edit subject", currentName);

    if (nextName === null) return;

    const trimmedName = nextName.trim();
    if (!trimmedName || trimmedName === currentName) return;

    const nextSubjects = subjectList.map((subject, index) => (
      index === indexToEdit ? trimmedName : subject
    ));

    onUpdateClass(classItem.id, { subjects: nextSubjects });
    showSuccess("Subject updated");
  };

  const deleteSubject = (indexToDelete) => {
    const nextSubjects = subjectList.filter((_, index) => index !== indexToDelete);
    onUpdateClass(classItem.id, { subjects: nextSubjects });
    showSuccess("Subject deleted");
  };

  const addSubject = () => {
    const nextName = window.prompt("New subject name", "");

    if (nextName === null) return;

    const trimmedName = nextName.trim();
    if (!trimmedName) return;

    onUpdateClass(classItem.id, { subjects: [...subjectList, trimmedName] });
    showSuccess("Subject added");
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

  const majorAndSubjectCards = (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-blue-700">Majors</h3>
          <button
            type="button"
            onClick={addProgram}
            className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            New
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[minmax(0,1fr)_74px_90px_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Name</span>
            <span>Year</span>
            <span>Shift</span>
            <span className="text-center">Action</span>
          </div>

          {programList.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500">No majors</div>
          ) : (
            programList.map((program, index) => (
              <div
                key={`${program.major || "major"}-${program.year || "year"}-${program.shift || "shift"}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_74px_90px_64px] items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
              >
                <span className="break-words pr-2 leading-snug">{program.major || "-"}</span>
                <span className="truncate">{program.year || "-"}</span>
                <span className="truncate">{program.shift || "-"}</span>
                <div className="flex w-[64px] items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => editProgram(index)}
                    className="rounded-md p-1 text-blue-600 transition hover:bg-blue-50"
                    aria-label="Edit major"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProgram(index)}
                    className="rounded-md p-1 text-rose-600 transition hover:bg-rose-50"
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

      <div className="w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-blue-700">Subjects</h3>
          <button
            type="button"
            onClick={addSubject}
            className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            New
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <span>Name</span>
            <span className="text-center">Action</span>
          </div>

          <div className="max-h-[412px] overflow-y-auto pr-1">
            {subjectList.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500">No subjects</div>
            ) : (
              <div className="space-y-2">
                {subjectList.map((subject, index) => (
                  <div
                    key={`${subject}-${index}`}
                    className="grid grid-cols-[1fr_64px] items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
                  >
                    <span className="break-words pr-2 leading-snug">{subject}</span>
                    <div className="flex w-[64px] items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => editSubject(index)}
                        className="rounded-md p-1 text-blue-600 transition hover:bg-blue-50"
                        aria-label="Edit subject"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSubject(index)}
                        className="rounded-md p-1 text-rose-600 transition hover:bg-rose-50"
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
            className="w-fit rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-700">
            Class {classItem.name}
          </h1>
        </div>

        <SummaryCards classItem={{ ...classItem, ...classForm }} studentsCount={students.length} />

        <section className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <section className="mb-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <input
                  type="text"
                  value={studentSearchText}
                  onChange={(event) => setStudentSearchText(event.target.value)}
                  placeholder="Search by ID, name, major, year, or shift..."
                  className="w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <select
                  value={selectedStudentMajor}
                  onChange={(event) => setSelectedStudentMajor(event.target.value)}
                  className="w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm text-slate-800 shadow-[0_12px_22px_-16px_rgba(30,64,175,0.5)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-lg border border-blue-200 bg-transparent px-3 py-2 text-sm font-semibold text-blue-800 shadow-[0_14px_26px_-16px_rgba(30,64,175,0.55)] transition hover:bg-transparent hover:shadow-[0_18px_32px_-18px_rgba(30,64,175,0.6)]"
                >
                  Clear
                </button>
              </div>
            </section>

            <StudentTable
              students={filteredStudents}
              highlightStudentId={highlightStudentId}
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
      >
        <div className="space-y-3">
          <input
            value={classForm.major}
            onChange={(event) => setClassForm((prev) => ({ ...prev, major: event.target.value }))}
            placeholder="Major"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={classForm.year}
            onChange={(event) => setClassForm((prev) => ({ ...prev, year: event.target.value }))}
            placeholder="Year"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={classForm.shift}
            onChange={(event) => setClassForm((prev) => ({ ...prev, shift: event.target.value }))}
            placeholder="Shift"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Student"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete {pendingDelete?.name}? This action cannot be undone.
        </p>
      </Modal>

      <Toast show={toast.show} message={toast.message} />
    </main>
  );
}

export default ClassDetail;
