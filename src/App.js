import './App.css';
import Menu from "./components/Menu";
import GradeListComponent from "./pages/GradeList"
import StudentListComponent from "./pages/StudentList"
import StudentPage from "./pages/StudentPage"
import AddStudent from "./pages/AddStudent"
import SignInForm from './pages/SignIn';
import Home from "./pages/Home"
import { Routes, Route } from "react-router-dom"

function App() {


    return (
        <section className="app">
            <header className="app-header">
                <Menu />
            </header>

            <main>


                <Routes >
                    <Route path='/students/:studentName' element={<StudentPage />} />
                    <Route path='/grades/:grade' element={<StudentListComponent />} />
                    <Route path='/students/add' element={<AddStudent />} />
                    <Route path='/students' element={<StudentListComponent />} />
                    <Route path='/grades' element={<GradeListComponent />} />
                    <Route path='/signIn' element={<SignInForm />} />
                    <Route path='/' element={<Home />} />
                </Routes>


            </main>
        </section>
    );
}

export default App;