import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const GradeListComponent = () => {
    const [gradesList, setGradesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/grades');
            setGradesList(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching grades:', err);
            setError('Failed to fetch grades. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const goToGrade = (gradeId) => {
        navigate(`/grades/${gradeId}`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <section className="container mt-4">
            <h2 className="mb-4">Grades List</h2>
            <div className="row">
                {gradesList.map((grade) => (
                    <div key={grade.id}>
                        <Button
                            variant="outline-primary"
                            className="w-100 mb-1 mt-1"
                            onClick={() => goToGrade(grade.id)}
                        >
                            {grade.grade}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GradeListComponent;
