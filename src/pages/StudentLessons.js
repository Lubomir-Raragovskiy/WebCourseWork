import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const StudentLessonsComponent = ({ studentId }) => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userDetails } = useContext(AuthContext);

    useEffect(() => {
        const fetchLessonsAndTeachers = async () => {
            setLoading(true);
            setError('');
            try {

                const lessonsResponse = await axios.get(`http://localhost:5000/api/students/${userDetails.user.grade}/lessons`);
                const lessonsData = lessonsResponse.data || {};

                const lessonsWithTeachers = await Promise.all(Object.keys(lessonsData).map(async lessonId => {
                    const lesson = lessonsData[lessonId];
                    try {
                        const teacherResponse = await axios.get(`http://localhost:5000/api/teachers/${lesson.teacherId}`);
                        return { ...lesson, teacherName: teacherResponse.data.name };
                    } catch (err) {
                        return { ...lesson, teacherName: "Not assigned" };
                    }
                }));

                setLessons(lessonsWithTeachers);
            } catch (error) {
                setError('Failed to fetch lessons');
            } finally {
                setLoading(false);
            }
        };

        fetchLessonsAndTeachers();
    }, [studentId, userDetails.user.grade]);


    return (
        <Container>
            <h2 className="my-4">Student Lessons</h2>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row xs={1} md={2} className="g-4">
                    {lessons.map((lesson, index) => (
                        <Col key={index}>
                            <div className="p-3 border bg-light">
                                <h5>{lesson.name}</h5>
                                <p>Teacher: {lesson.teacherName}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default StudentLessonsComponent;
