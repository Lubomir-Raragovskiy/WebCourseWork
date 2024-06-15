import React, { useContext } from 'react';
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../utils/authContext';
import '../styles/Card.css';

const StudentCard = ({ student, onDelete }) => {
    const navigate = useNavigate();
    const { role } = useContext(AuthContext);

    const goToDetails = () => {
        navigate("/students/" + student.id);
    };

    const deleteStudent = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/students/${student.id}`);
            await axios.delete(`http://localhost:5000/api/users/${student.uid}`);
            onDelete(student.id);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Img variant="top" src={student.portraitSrc} />
                <Card.Title>{student.studentName}</Card.Title>
                <Card.Text>{student.grade}</Card.Text>
                {role && (
                    <Button variant="outline-primary" onClick={goToDetails}>Student details</Button>)}

                {role === 'admin' && (
                    <Button variant="outline-secondary" onClick={deleteStudent} className="ms-2">Delete</Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default StudentCard;
