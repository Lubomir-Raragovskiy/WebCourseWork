import React, { useState, useEffect } from 'react';
import { Button, Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from 'axios';
import StudentCard from "../components/StudentCard";
import { useNavigate, useParams } from "react-router-dom";

const StudentListComponent = () => {
    const { grade } = useParams();
    const [studentList, setStudentList] = useState([]);
    const [filteredStudentList, setFilteredStudentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/students');
                setStudentList(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching students');
                console.error(error);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const applyFilter = () => {
            if (grade) {
                const filtered = studentList.filter(student => student.grade === grade);
                setFilteredStudentList(filtered);
            } else {
                setFilteredStudentList(studentList);
            }
        };

        applyFilter();
    }, [grade, studentList]);

    const handleDelete = (id) => {
        setStudentList(studentList.filter(student => student.id !== id));
    };

    return (
        <Container>
            <h2 className="my-4">Student List</h2>
            <Button variant="secondary" onClick={() => navigate('/students/add')} className="mb-3">
                Add New Student
            </Button>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {filteredStudentList.map(student => (
                        <Col key={student.id} xs={12} sm={6} md={4} lg={3}>
                            <StudentCard student={student} onDelete={handleDelete} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default StudentListComponent;
