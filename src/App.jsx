import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import MainPage from './component/layouts/MainPage.jsx';
import StudentPage from './pages/student/StudentPage.jsx';
import CreateStudent from './pages/student/CreateStudent.jsx';
import ScorePage from './pages/score/ScorePage.jsx';
import AttendantPage from './pages/attendant/AttendantPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import Academic from './pages/academic/academic.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage/>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/createStudent" element={<CreateStudent />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="/attendant" element={<AttendantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App