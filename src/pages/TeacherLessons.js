import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherLessonsComponent = () => {
    const { userDetails } = useContext(AuthContext);
    const teacherId = userDetails ? userDetails.id : null;
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (teacherId) {
            fetchLessons();
        }
    }, [teacherId]);

    const fetchLessons = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/teachers/${teacherId}/lessons`);
            setLessons(response.data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const navigateToAssignMarks = (grade, name) => {
        navigate(`/marks/${grade}/${name}`);
    };

    return (
        <div>
            <h2>Lessons for {userDetails ? userDetails.user.name : ''}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Grade</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson, index) => (
                        <tr key={index}>
                            <td>{lesson.name}</td>
                            <td>{lesson.grade}</td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => navigateToAssignMarks(lesson.grade, lesson.name)}
                                    className="mb-3">
                                    Assign Grade
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TeacherLessonsComponent;
