import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

// Layouts
import MainPage from './component/layouts/MainPage.jsx';
import LoginPage from './component/layouts/LoginPage.jsx';
// import RegisterPage from './component/layouts/RegisterPage.jsx';

// Pages
import UserManage from './pages/user/UserManage.jsx';
import ProfileSettings from './pages/user/ProfileSettings.jsx';
import RoleManage from './pages/user/RoleManage.jsx';
import AuditLog from './pages/user/AuditLog.jsx';
import StudentPage from './pages/student/StudentPage.jsx';
import StudentPrintPage from './pages/student/StudentPrintPage.jsx';
import CreateStudent from './pages/student/CreateStudent.jsx';
import ScholarExam from './pages/student/ScholarExam.jsx';
import ScholarExamPrintPage from './pages/student/ScholarExamPrintPage.jsx';
import ResultScholar from './pages/student/ResultScholar.jsx';
// import SortConfirm from './pages/student/SortConfirm.jsx';
import ScorePage from './pages/final/ScorePage.jsx';
import ScoreByTeacher from './pages/final/ScoreByTeacher.jsx';
import AttendantPage from './pages/attendant/AttendantPage.jsx';
import AttendantListPage from './pages/attendant/AttendantListPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import Academic from './pages/academic/academic.jsx';
import ScholarshipForm from './pages/scholarship/ScholarshipForm.jsx';
import Receipt from './pages/scholarship/Receipt.jsx';
import Cover from './pages/scholarship/Cover.jsx';
import Reciept from './pages/enrollment/Reciept.jsx';
import SortingPage from './pages/student/SortingPage.jsx';
import ListNameExam from './pages/final/ListNameExam.jsx';
import SearchForm from './component/layouts/SearchForm.jsx';

import Form from './pages/enrollment/Form.jsx';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}

          {/* Private Routes (Inside MainPage Layout) */}
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
            {/* <Route path="/sortConfirm" element={<SortConfirm />} /> */}
            <Route path="/academic" element={<Academic />} />
            <Route path="/scholarshipForm" element={<ScholarshipForm />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/cover" element={<Cover />} />
            <Route path="/enrollmentForm" element={<Form />} />
            <Route path="/enrollmentReciept" element={<Reciept />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/scoreTeacher" element={<ScoreByTeacher />} />
            <Route path="/attendant" element={<AttendantPage />} />
            <Route path="/attendant/take" element={<AttendantPage />} />
            <Route path="/attendant/list" element={<AttendantListPage />} />
            <Route path="/listNameExam" element={<ListNameExam />} />
            <Route path="/searchForm" element={<SearchForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;