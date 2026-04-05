import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

// Layouts
import MainPage from "./component/layouts/MainPage.jsx";
import LoginPage from "./component/layouts/LoginPage.jsx";

// Pages
import UserManage from "./pages/user/UserManage.jsx";
import ProfileSettings from "./pages/user/ProfileSettings.jsx";
import RoleManage from "./pages/user/RoleManage.jsx";
import AuditLog from "./pages/user/AuditLog.jsx";
import StudentPage from "./pages/student/StudentPage.jsx";
import StudentPrintPage from "./pages/student/StudentPrintPage.jsx";
import CreateStudent from "./pages/student/CreateStudent.jsx";
import ScholarExam from "./pages/student/ScholarExam.jsx";
import ScholarExamPrintPage from "./pages/student/ScholarExamPrintPage.jsx";
import ResultScholar from "./pages/student/ResultScholar.jsx";
import ResultFinal from "./pages/final/ResultFinal.jsx";
import ScoreByTeacher from "./pages/final/ScoreByTeacher.jsx";
import AttendantPage from "./pages/attendant/AttendantPage.jsx";
import AttendantListPage from "./pages/attendant/AttendantListPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Academic from "./pages/academic/Academic.jsx";
import ScholarshipForm from "./pages/scholarship/ScholarshipForm.jsx";
import Receipt from "./pages/scholarship/Receipt.jsx";
import Cover from "./pages/scholarship/Cover.jsx";
import Reciept from "./pages/enrollment/Reciept.jsx";
import SortingPage from "./pages/student/SortingPage.jsx";
import ListNameExam from "./pages/final/ListNameExam.jsx";
import ListNamePrint from "./pages/final/ListNamePrint.jsx";
import ResultFinalPrint from "./pages/final/ResultFinalPrint.jsx";
import ListNameReexam from "./pages/final/ListNameReexam.jsx";
import ListNameReexamPrint from "./pages/final/ListNameReexamPrint.jsx";
import SearchForm from "./component/layouts/SearchForm.jsx";
import Form from "./pages/enrollment/Form.jsx";

import ClassList from "./pages/ClassList.jsx";
import ClassDetail from "./pages/ClassDetail.jsx";
import { DEFAULT_CLASSES } from "./data/classSeed.js";

const STORAGE_KEY = "sms-classes-v1";
const MAX_PROGRAMS_PER_CLASS = 4;

function normalizeClassData(rawClasses) {
  if (!Array.isArray(rawClasses)) return DEFAULT_CLASSES;

  const defaultsById = new Map(DEFAULT_CLASSES.map((item) => [item.id, item]));

  const normalizedSavedClasses = rawClasses.map((rawItem) => {
    const fallback = defaultsById.get(rawItem.id);

    const programs =
      Array.isArray(rawItem.programs) && rawItem.programs.length > 0
        ? rawItem.programs
        : Array.isArray(fallback?.programs) && fallback.programs.length > 0
          ? fallback.programs
          : [
              {
                major: rawItem.major || fallback?.major || "General",
                year: rawItem.year || fallback?.year || "Year 1",
                shift: rawItem.shift || fallback?.shift || "Morning"
              }
            ];

    const baseProgram = programs[0];
    const students = (rawItem.students || fallback?.students || []).map((student) => ({
      ...student,
      major: student.major || baseProgram.major,
      year: student.year || baseProgram.year,
      shift: student.shift || baseProgram.shift
    }));

    return {
      ...fallback,
      ...rawItem,
      programs,
      students,
      major: rawItem.major || fallback?.major || baseProgram.major,
      year: rawItem.year || fallback?.year || baseProgram.year,
      shift: rawItem.shift || fallback?.shift || baseProgram.shift
    };
  });

  const existingIds = new Set(normalizedSavedClasses.map((classItem) => classItem.id));
  const missingDefaultClasses = DEFAULT_CLASSES.filter((classItem) => !existingIds.has(classItem.id));

  return [...normalizedSavedClasses, ...missingDefaultClasses];
}

function App() {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return normalizeClassData(DEFAULT_CLASSES);

    try {
      return normalizeClassData(JSON.parse(saved));
    } catch {
      return normalizeClassData(DEFAULT_CLASSES);
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  const updateClassById = (classId, updates) => {
    setClasses((prev) =>
      prev.map((classItem) => (classItem.id === classId ? { ...classItem, ...updates } : classItem))
    );
  };

  const createClass = (newClassDraft) => {
    const normalizedName = String(newClassDraft?.name || "").trim();
    if (!normalizedName) return null;

    const classNameExists = classes.some(
      (classItem) => String(classItem.name || "").trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (classNameExists) return null;

    const incomingPrograms = Array.isArray(newClassDraft?.programs) ? newClassDraft.programs : [];
    const normalizedPrograms = [];
    const majorKeySet = new Set();

    incomingPrograms.forEach((program) => {
      if (normalizedPrograms.length >= MAX_PROGRAMS_PER_CLASS) {
        return;
      }

      const major = String(program?.major || "").trim();
      const year = String(program?.year || "").trim();
      const shift = String(program?.shift || "").trim();

      if (!major || !year || !shift) {
        return;
      }

      const majorKey = major.toLowerCase();
      if (majorKeySet.has(majorKey)) {
        return;
      }

      majorKeySet.add(majorKey);
      normalizedPrograms.push({ major, year, shift });
    });

    const fallbackProgram = normalizedPrograms[0] || {
      major: "General",
      year: "Year 1",
      shift: "Morning"
    };

    if (normalizedPrograms.length === 0) {
      normalizedPrograms.push(fallbackProgram);
    }

    const normalizedSubjects = [];
    const subjectKeySet = new Set();

    (Array.isArray(newClassDraft?.subjects) ? newClassDraft.subjects : []).forEach((subject) => {
      const cleanedSubject = String(subject || "").trim();
      if (!cleanedSubject) return;

      const subjectKey = cleanedSubject.toLowerCase();
      if (subjectKeySet.has(subjectKey)) return;

      subjectKeySet.add(subjectKey);
      normalizedSubjects.push(cleanedSubject);
    });

    const nextId = classes.reduce((maxId, classItem) => Math.max(maxId, Number(classItem.id) || 0), 0) + 1;

    const newClass = {
      id: nextId,
      name: normalizedName,
      major: fallbackProgram.major,
      year: fallbackProgram.year,
      shift: fallbackProgram.shift,
      programs: normalizedPrograms,
      subjects: normalizedSubjects,
      students: []
    };

    setClasses((prev) => [...prev, newClass]);
    return newClass;
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<MainPage />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/userManage" element={<UserManage />} />
            <Route path="/roleManage" element={<RoleManage />} />
            <Route path="/auditLog" element={<AuditLog />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/studentPrint" element={<StudentPrintPage />} />
            <Route path="/sortingpage" element={<SortingPage />} />
            <Route path="/createStudent" element={<CreateStudent />} />
            <Route path="/scholarExam" element={<ScholarExam />} />
            <Route path="/scholarExamPrint" element={<ScholarExamPrintPage />} />
            <Route path="/resultScholar" element={<ResultScholar />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/scholarshipForm" element={<ScholarshipForm />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/cover" element={<Cover />} />
            <Route
              path="/enrollmentForm"
              element={<Form classes={classes} onUpdateClass={updateClassById} />}
            />
            <Route path="/enrollmentReciept" element={<Reciept />} />
            <Route path="/resultFinal" element={<ResultFinal />} />
            <Route path="/scoreTeacher" element={<ScoreByTeacher />} />
            <Route path="/attendant/take" element={<AttendantPage />} />
            <Route path="/attendant/list" element={<AttendantListPage />} />
            <Route path="/listNameExam" element={<ListNameExam />} />
            <Route path="/final/ListNamePrint" element={<ListNamePrint />} />
            <Route path="/finalResultPrint" element={<ResultFinalPrint />} />
            <Route path="/ListNameReexam" element={<ListNameReexam />} />
            <Route path="/ReexamPrint" element={<ListNameReexamPrint />} />
            <Route path="/searchForm" element={<SearchForm />} />

            <Route path="/classes" element={<ClassList classes={classes} onCreateClass={createClass} />} />
            <Route
              path="/class/:id"
              element={<ClassDetail classes={classes} onUpdateClass={updateClassById} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;