import React, { useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import axios from 'axios';
import StudentCard from "../components/StudentCard";
import { useNavigate, useParams } from "react-router-dom";

const StudentListComponent = () => {
    const { grade } = useParams();
    const [studentList, setStudentList] = useState([]);
    const [filteredStudentList, setFilteredStudentList] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [grade, studentList]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students');
            setStudentList(response.data);
        } catch (error) {
            setError('Error fetching students');
            console.error(error);
        }
    };

    const applyFilter = () => {
        if (grade) {
            const filtered = studentList.filter(student => student.grade === grade);
            setFilteredStudentList(filtered);
        } else {
            setFilteredStudentList(studentList);
        }
    };

    const handleDelete = (id) => {
        setStudentList(studentList.filter(student => student.id !== id));
    };

    return (
        <section className="container">
            <Button variant="outline-secondary" className="w-100 mb-1 mt-1" onClick={() => navigate("/students/add")}>Add</Button>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {filteredStudentList.map(student => (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xm-12" key={student.id}>
                        <StudentCard card={student} onDelete={handleDelete} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StudentListComponent;
