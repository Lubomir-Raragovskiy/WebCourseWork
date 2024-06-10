import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeachersCard from '../components/TeacherCard';

const TeachersListComponent = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            setError('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setTeachers(teachers.filter(teacher => teacher.id !== id));
    };

    return (
        <Container>
            <h2 className="my-4">Teachers List</h2>
            <Button variant="secondary" onClick={() => navigate('/teachers/add')} className="mb-3">
                Add New Teacher
            </Button>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {teachers.map(teacher => (
                        <Col key={teacher.id} xs={12} sm={6} md={4} lg={3}>
                            <TeachersCard teacher={teacher} onDelete={handleDelete} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default TeachersListComponent;
