import React from 'react';
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

    return (
        <Card>
            <Card.Img variant="top" src={props.card.studentPortraitSrc} />
            <Card.Body>
                <Card.Title>{props.card.studentName}</Card.Title>
                <Card.Text>{props.card.grade}</Card.Text>
                <Button variant="outline-secondary" onClick={goToDetails}>Student details</Button>
            </Card.Body>
        </Card>
    );
};

export default StudentCard;
