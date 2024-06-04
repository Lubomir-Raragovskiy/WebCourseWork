import React from 'react';
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const StudentCard = (props) => {
    const navigate = useNavigate();

    const goToDetails = () => {
        localStorage.setItem('selectedStudent', JSON.stringify({
            studentName: props.card.studentName,
            grade: props.card.grade,
            studentPortraitSrc: props.card.studentPortraitSrc
        }));
        navigate("/students/" + props.card.studentName);
    };

    const deleteStudent = async () => {
        try {

            await axios.delete(`http://localhost:5000/api/students/${props.card.id}`);
            await axios.delete(`http://localhost:5000/api/users/${props.card.uid}`);
            props.onDelete(props.card.id);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <Card>
            <Card.Img variant="top" src={props.card.portraitSrc} />
            <Card.Body>
                <Card.Title>{props.card.studentName}</Card.Title>
                <Card.Text>{props.card.grade}</Card.Text>
                <Button variant="outline-secondary" onClick={goToDetails}>Student details</Button>
                <Button variant="outline-secondary" onClick={deleteStudent} className="ms-2">Delete</Button>
            </Card.Body>
        </Card>
    );
};

export default StudentCard;
