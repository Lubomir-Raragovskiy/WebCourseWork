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
                if (Array.isArray(lessonsResponse.data)) {
                    const lessonsWithTeachers = await Promise.all(
                        lessonsResponse.data.map(async lesson => {
                            try {
                                const teacherResponse = await axios.get(`http://localhost:5000/api/teachers/${lesson.teacherId}`);
                                return { ...lesson, teacherName: teacherResponse.data.name };
                            } catch (err) {
                                return { ...lesson, teacherName: "Not assigned" };
                            }
                        })
                    );
                    setLessons(lessonsWithTeachers);
                } else {
                    setError('Unexpected response format');
                }
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
                <Col>
                    {lessons.map(lesson => (
                        <Row key={lesson.id} xs={12} sm={6} md={4} lg={3}>

                                <h5>{lesson.name}</h5>
                                <h5>{lesson.teacherName}</h5>

                        </Row>
                    ))}
                </Col>
            )}
        </Container>
    );
};

export default StudentLessonsComponent;
