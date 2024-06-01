import React, { useState, useEffect, useRef } from 'react';
import { Button } from "react-bootstrap";
import useSelect from "../utils/useSelect";
import StudentCard from "../components/StudentCard";
import { useNavigate } from "react-router-dom";

const StudentListComponent = () => {
    const [studentList, setStudentList] = useState([]);
    const navigate = useNavigate();

    const gradeFilter = useRef(localStorage.getItem('gradeFilter'));
    
    useEffect(() => {
        localStorage.removeItem('gradeFilter');
    }, []);

    const data = useSelect("Students", 'grade', gradeFilter.current);

    useEffect(() => {
        if (data) {
            setStudentList(data);
        }
    }, [data]);

    
    return (
        <section className="container">
            <Button variant="outline-secondary" className="w-100 mb-1 mt-1" onClick={() => navigate("/students/add")}>Add</Button>
            <div className="row">
                {studentList.map(student => (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xm-12" key={student.id}>
                        <StudentCard card={student} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StudentListComponent;
