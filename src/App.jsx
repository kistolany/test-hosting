import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainPage from './component/layouts/MainPage.jsx';
import LoginPage from './component/layouts/LoginPage.jsx';
import RegisterPage from './component/layouts/RegisterPage.jsx';

// Pages
import UserManage from './pages/user/UserManage.jsx';
import StudentPage from './pages/student/StudentPage.jsx';
import CreateStudent from './pages/student/CreateStudent.jsx';
import ScorePage from './pages/score/ScorePage.jsx';
import AttendantPage from './pages/attendant/AttendantPage.jsx';
import AttenList from './pages/attendant/AttenList.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import Academic from './pages/academic/academic.jsx';
import ScholarshipForm from './pages/scholarship/ScholarshipForm.jsx';
import Receipt from './pages/scholarship/Receipt.jsx';
import Cover from './pages/scholarship/Cover.jsx';
import Reciept from './pages/enrollment/Reciept.jsx';
import SortingPage from './pages/student/SortingPage.jsx';

// IMPORTANT: Renamed your local Form to EnrollmentForm to avoid errors
import Form from './pages/enrollment/Form.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sortingpage" element={<SortingPage />} />

        {/* Private Routes (Inside MainPage Layout) */}
        <Route element={<MainPage />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/userManage" element={<UserManage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/createStudent" element={<CreateStudent />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/scholarshipForm" element={<ScholarshipForm />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/cover" element={<Cover />} />
          <Route path="/enrollmentForm" element={<Form />} />
          <Route path="/enrollmentReciept" element={<Reciept />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="/attendant" element={<AttendantPage />} />
          <Route path="/attenlist" element={<AttenList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;