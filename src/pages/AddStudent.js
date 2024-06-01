import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { db } from "../utils/firebase";
import { push, ref } from "firebase/database";
import axios from 'axios';

const AddStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [portraitSrc, setPortraitSrc] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentName || !grade || !portraitSrc || !email || !password) { 
            alert('Please fill in all fields');
            return;
        }

        try {
            const role = "student";

            const response = await axios.post('http://localhost:5000/api/signup', { email, role, password });

            const id = response.data.customToken;

            const newStudentRef = ref(db, 'Students');
            await push(newStudentRef, {
                id,
                studentName,
                grade,
                portraitSrc,
                email,
                password
            });

            setStudentName('');
            setGrade('');
            setPortraitSrc('');
            setEmail(''); 
            setPassword('');

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

                <Form.Group className="mb-3" controlId="email"> 
                    <Form.Label>Email</Form.Label> 
                    <Form.Control
                        type="text"
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
