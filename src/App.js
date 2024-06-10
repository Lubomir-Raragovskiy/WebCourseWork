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
import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"
import GradeLessonsComponent from './pages/GradeLessons';

function App() {


    return (
        <section className="app">
            <header className="app-header">
                <Menu />
            </header>

            <main>


                <Routes >
                    <Route path='/students/:id' element={<StudentPage />} />
                    <Route path='/teachers/:id' element={<TeacherPage />} />
                    <Route path='/grades/:gradeId' element={<GradeLessonsComponent />} />
                    <Route path='/students/add' element={<AddStudent />} />
                    <Route path='/teachers/add' element={<AddTeacher />} />
                    <Route path='/students' element={<StudentListComponent />} />
                    <Route path='/teachers' element={<TeachersListComponent />} />
                    <Route path='/grades' element={<GradeListComponent />} />
                    <Route path='/signIn' element={<SignInForm />} />
                    <Route path='/controlPanel' element={<ControlPanel />} />
                    <Route path='/addUser' element={<AddUser />} />
                    <Route path='/' element={<Home />} />
                </Routes>


            </main>
        </section>
    );
}

export default App;