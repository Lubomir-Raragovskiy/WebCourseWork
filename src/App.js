import './App.css';
import Menu from "./components/Menu";
import GradeListComponent from "./pages/GradeList"
import StudentListComponent from "./pages/StudentList"
import TeachersListComponent from './pages/TeacherList';
import StudentPage from "./pages/StudentPage"
import TeacherPage from "./pages/TeacherPage";
import AddStudent from "./pages/AddStudent"
import AddTeacher from './pages/AddTeacher';
import SignInForm from "./pages/SignIn";
import ControlPanel from "./pages/ControlPanel"
import AddUser from './pages/AddUser';
import AccessDenied from './pages/AccessDenied'
import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"
import GradeLessonsComponent from './pages/GradeLessons';
import TeacherLessonsComponent from './pages/TeacherLessons';
import StudentLessonsComponent from './pages/StudentLessons'
import { AuthProvider } from './utils/authContext';
import PrivateRoute from './components/PrivateRoute';




function App() {
    return (
        <AuthProvider>
            <section className="app">
                <header className="app-header">
                    <Menu />
                </header>

                <main>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/signIn' element={<SignInForm />} />
                        <Route path='/accessDenied' element={<AccessDenied />} />
                        <Route path='/students' element={<StudentListComponent/>} />
                        <Route path='/teachers'element={<TeachersListComponent />} />
                        <Route path='/grades' element={<PrivateRoute element={<GradeListComponent />} allowedRoles={['admin']} />} />
                        <Route path='/teacherLessons' element={<PrivateRoute element={<TeacherLessonsComponent />} allowedRoles={['teacher']} />} />
                        <Route path='/studentLessons' element={<PrivateRoute element={<StudentLessonsComponent />} allowedRoles={['student']} />} />
                        <Route path='/students/add' element={<PrivateRoute element={<AddStudent />} allowedRoles={['admin']} />} />
                        <Route path='/teachers/add' element={<PrivateRoute element={<AddTeacher />} allowedRoles={['admin']} />} />
                        <Route path='/addUser' element={<PrivateRoute element={<AddUser />} allowedRoles={['admin']} />} />
                        <Route path='/controlPanel' element={<PrivateRoute element={<ControlPanel />} allowedRoles={['admin']} />} />
                        <Route path='/students/:id' element={<StudentPage />} />
                        <Route path='/teachers/:id' element={<TeacherPage />} />
                        <Route path='/grades/:gradeId' element={<PrivateRoute element={<GradeLessonsComponent />} allowedRoles={['admin']} />} />
                    </Routes>
                </main>
            </section>
        </AuthProvider>
    );
}

export default App;
