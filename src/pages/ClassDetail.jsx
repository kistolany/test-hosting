import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { SummaryCards } from "../components/Cards";
import Filters from "../components/Filters";
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
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [major, setMajor] = useState("All");
  const [year, setYear] = useState("All");
  const [shift, setShift] = useState("All");
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

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchedSearch = student.name.toLowerCase().includes(search.toLowerCase());
      const matchedGender = gender === "All" || student.gender === gender;
      const matchedMajor = major === "All" || student.major === major;
      const matchedYear = year === "All" || student.year === year;
      const matchedShift = shift === "All" || student.shift === shift;
      return matchedSearch && matchedGender && matchedMajor && matchedYear && matchedShift;
    });
  }, [students, search, gender, major, year, shift]);

  const majorOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...classPrograms.map((item) => item.major),
          ...students.map((student) => student.major)
        ].filter(Boolean))
      ),
    [classPrograms, students]
  );
  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...classPrograms.map((item) => item.year),
          ...students.map((student) => student.year)
        ].filter(Boolean))
      ),
    [classPrograms, students]
  );
  const shiftOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...classPrograms.map((item) => item.shift),
          ...students.map((student) => student.shift)
        ].filter(Boolean))
      ),
    [classPrograms, students]
  );

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-cyan-50 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Header
          classItem={{ ...classItem, ...classForm }}
          onOpenEdit={() => setClassModalOpen(true)}
          backPath="/classes"
        />
        <SummaryCards classItem={{ ...classItem, ...classForm }} studentsCount={students.length} />

        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Programs in this class</h3>
          <div className="flex flex-wrap gap-2">
            {classPrograms.map((program, index) => (
              <span
                key={`${program.major}-${program.year}-${program.shift}-${index}`}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {program.major} | {program.year} | {program.shift}
              </span>
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
            <Filters
              search={search}
              gender={gender}
              major={major}
              year={year}
              shift={shift}
              majorOptions={majorOptions}
              yearOptions={yearOptions}
              shiftOptions={shiftOptions}
              onSearchChange={setSearch}
              onGenderChange={setGender}
              onMajorChange={setMajor}
              onYearChange={setYear}
              onShiftChange={setShift}
            />
            <StudentTable
              students={filteredStudents}
              highlightStudentId={highlightStudentId}
              onSaveInline={saveInlineEdit}
              onDeleteRequest={openDeleteModal}
            />
          </>
        )}

        {activeTab === "Subjects" && (
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {classItem.subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800"
                >
                  {subject}
                </span>
              ))}
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
