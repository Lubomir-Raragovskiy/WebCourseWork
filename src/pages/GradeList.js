import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from 'axios';

const GradeListComponent = () => {
    const [gradesList, setGradesList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/grades');
            setGradesList(response.data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const goToGrade = (grade) => {
        navigate(`/grades/${grade}`);
    };

    return (
        <section className="container">
            <div className="row">
                {gradesList.map(grade => (
                    <div key={grade.id}>
                        <Button variant="outline-secondary"
                            className="w-100 mb-1 mt-1"
                            onClick={() => goToGrade(grade.grade)}> 
                            {grade.grade}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GradeListComponent;
