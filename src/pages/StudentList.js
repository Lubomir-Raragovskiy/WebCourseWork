import React, { useState, useEffect, useContext } from 'react';
import { Button, Container, Spinner, Alert, Row, Col, Form } from "react-bootstrap";
import axios from 'axios';
import StudentCard from "../components/StudentCard";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../utils/authContext';

const StudentListComponent = () => {
    const { grade } = useParams();
    const { role } = useContext(AuthContext);
    const [studentList, setStudentList] = useState([]);
    const [filteredStudentList, setFilteredStudentList] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(grade || '');
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

        const fetchGrades = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/grades');
                setGrades(response.data);
            } catch (error) {
                setError('Error fetching grades');
                console.error(error);
            }
        };

        fetchStudents();
        fetchGrades();
    }, []);

    useEffect(() => {
        const applyFilter = () => {
            if (selectedGrade) {
                const filtered = studentList.filter(student => student.grade === selectedGrade);
                setFilteredStudentList(filtered);
            } else {
                setFilteredStudentList(studentList);
            }
        };

        applyFilter();
    }, [selectedGrade, studentList]);

    const handleDelete = (id) => {
        setStudentList(studentList.filter(student => student.id !== id));
    };

    return (
        <Container>
            <h2 className="my-4">Student List</h2>
            {role === 'admin' && (
                <Button variant="outline-primary" onClick={() => navigate('/students/add')} className="mb-3">
                    Add New Student
                </Button>
            )}
            <Form.Group controlId="gradeSelect" className="mb-3">
                <Form.Label>Select Grade</Form.Label>
                <Form.Control as="select" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                    <option value="">All Grades</option>
                    {grades.map(grade => (
                        <option key={grade.id} value={grade.grade}>{grade.grade}</option>
                    ))}
                </Form.Control>
            </Form.Group>
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
