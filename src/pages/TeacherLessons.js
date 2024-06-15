import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext'; 
import { Table } from 'react-bootstrap';
import axios from 'axios';

const TeacherLessonsComponent = () => {
    const { userDetails } = useContext(AuthContext); 
    const teacherId = userDetails ? userDetails.id : null; 
    const [lessons, setLessons] = useState([]);

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

    return (
        console.log(userDetails),
        <div>
            <h2>Lessons for {userDetails ? userDetails.user.name : ''}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson, index) => (
                        <tr key={index}>
                            <td>{lesson.name}</td>
                            <td>{lesson.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TeacherLessonsComponent;
