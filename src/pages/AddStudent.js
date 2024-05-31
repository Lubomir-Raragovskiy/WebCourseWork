import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { db } from "../utils/firebase";
import { push, ref } from "firebase/database";

const AddStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [portraitSrc, setPortraitSrc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentName || !grade || !portraitSrc) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const newStudentRef = ref(db, 'Students');
            await push(newStudentRef, {
                studentName,
                grade,
                portraitSrc
            });

            
            setStudentName('');
            setGrade('');
            setPortraitSrc('');

            alert('Student added successfully!');
        } catch (error) {
            console.error('Error adding student: ', error);
            alert('An error occurred while adding the student. Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Add Student</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="studentName">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="grade">
                    <Form.Label>Grade</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="portraitSrc">
                    <Form.Label>Portrait Source</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter portrait source"
                        value={portraitSrc}
                        onChange={(e) => setPortraitSrc(e.target.value)}
                    />
                </Form.Group>

                <Button variant="outline-secondary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default AddStudent;