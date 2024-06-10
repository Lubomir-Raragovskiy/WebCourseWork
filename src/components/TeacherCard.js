import React from 'react';
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TeachersCard = ({ teacher, onDelete }) => {
    const navigate = useNavigate();

    const goToDetails = () => {
        navigate("/teachers/" + teacher.id);
    };

    const deleteTeacher = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/teachers/${teacher.id}`);
            await axios.delete(`http://localhost:5000/api/users/${teacher.uid}`);
            onDelete(teacher.id);
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Img variant="top" src={teacher.portraitSrc} />
                <Card.Title>{teacher.name}</Card.Title>
                <Card.Text>
                    Subjects: {teacher.subjects ? teacher.subjects.join(', ') : 'None'}
                </Card.Text>
                <Button variant="outline-secondary" onClick={goToDetails}>Teacher details</Button>
                <Button variant="outline-danger" onClick={deleteTeacher} className="ms-2">Delete</Button>
            </Card.Body>
        </Card>
    );
};

export default TeachersCard;
