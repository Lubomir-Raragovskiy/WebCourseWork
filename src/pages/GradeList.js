import React, { useState, useEffect } from 'react';
import useSelect from "../utils/useSelect";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const GradeListComponent = () => {
    const [gradesList, setGradesList] = useState([]);
    const navigate = useNavigate();

    const grades = useSelect("Grades");

    useEffect(() => {
        if (grades) {
            setGradesList(grades);
        }
    }, [grades]);


    const goToGrade = (grade) => {
        localStorage.setItem('gradeFilter', grade);
        navigate(`/grades/${grade}`);
    };

    return (
        <section className="container">
            <div className="row">
                {gradesList.map(grade => (
                    <div key={grade.id}>
                        <Button variant="outline-secondary"
                            className="w-100 mb-1 mt-1"
                            onClick={() => goToGrade(grade.grade)}> {grade.grade}</Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GradeListComponent;
