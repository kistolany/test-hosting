import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SummaryCards } from "../components/Cards";
import StudentTable from "../components/StudentTable";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

const TABS = ["Students", "Subjects", "Attendance", "Scores"];

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
  const [activeTab, setActiveTab] = useState("Students");

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

  const subjectList = Array.isArray(classItem.subjects) ? classItem.subjects : [];

  const deleteProgram = (indexToDelete) => {
    const sourcePrograms =
      Array.isArray(classItem.programs) && classItem.programs.length > 0
        ? classItem.programs
        : classPrograms;

    if (sourcePrograms.length <= 1) return;

    const nextPrograms = sourcePrograms.filter((_, index) => index !== indexToDelete);
    const firstProgram = nextPrograms[0] || { major: classItem.major, year: classItem.year, shift: classItem.shift };

    onUpdateClass(classItem.id, {
      programs: nextPrograms,
      major: firstProgram.major,
      year: firstProgram.year,
      shift: firstProgram.shift
    });

    showSuccess("Program deleted");
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

        <section className="w-full max-w-[410px] self-end rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-blue-700">Programs in this class</h3>
            <button
              type="button"
              onClick={() => setClassModalOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              New
            </button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-[1.35fr_0.65fr_0.95fr_56px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span>Major</span>
              <span className="text-center">Year</span>
              <span className="text-center">Shift</span>
              <span className="text-center">Action</span>
            </div>
            {classPrograms.map((program, index) => (
              <div
                key={`${program.major}-${program.year}-${program.shift}-${index}`}
                className="grid grid-cols-[1.35fr_0.65fr_0.95fr_56px] items-center gap-x-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
              >
                <span className="break-words pr-2 leading-snug">{program.major}</span>
                <span className="text-center leading-snug">{program.year}</span>
                <span className="text-center leading-snug">{program.shift}</span>
                <div className="flex w-[64px] items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setClassForm({ major: program.major, year: program.year, shift: program.shift });
                      setClassModalOpen(true);
                    }}
                    className="rounded-md p-1 text-blue-600 transition hover:bg-blue-50"
                    aria-label="Edit program"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProgram(index)}
                    className="rounded-md p-1 text-rose-600 transition hover:bg-rose-50"
                    aria-label="Delete program"
                    disabled={classPrograms.length <= 1}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Students" && (
          <>
            <StudentTable
              students={students}
              highlightStudentId={highlightStudentId}
              onSaveInline={saveInlineEdit}
              onDeleteRequest={openDeleteModal}
            />
          </>
        )}

        {activeTab === "Subjects" && (
          <section className="w-full max-w-[410px] self-end rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-blue-700">Subjects</h3>
              <button
                type="button"
                onClick={addSubject}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                New
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_64px] gap-x-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>Name</span>
                <span className="text-center">Action</span>
              </div>

              {subjectList.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-500">No subjects</div>
              ) : (
                subjectList.map((subject, index) => (
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
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "Attendance" && (
          <section className="rounded-xl bg-white p-5 text-slate-600 shadow-sm ring-1 ring-slate-200">
            Attendance overview can be added here.
          </section>
        )}

        {activeTab === "Scores" && (
          <section className="rounded-xl bg-white p-5 text-slate-600 shadow-sm ring-1 ring-slate-200">
            Score dashboard can be added here.
          </section>
        )}
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
