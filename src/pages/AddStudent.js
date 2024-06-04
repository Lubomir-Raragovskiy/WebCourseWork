import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [portraitFile, setPortraitFile] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && validImageTypes.includes(file.type)) {
            setPortraitFile(file);
        } else {
            alert('Please upload a valid image file (jpg, png, or gif).');
            setPortraitFile(null);
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentName || !grade || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            let portraitSrc = '';

            if (portraitFile) {
                const formData = new FormData();
                formData.append('file', portraitFile);

                const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                portraitSrc = uploadResponse.data.fileUrl;
            }

            const response = await axios.post('http://localhost:5000/api/students', {
                studentName,
                grade,
                portraitSrc,
                email,
                password,
            });

            setStudentName('');
            setGrade('');
            setPortraitFile(null);
            setEmail('');
            setPassword('');

            document.getElementById('portraitFile').value = null;

            alert('Student added successfully!');
        } catch (error) {
            console.error('Error adding student:', error);
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

                <Form.Group className="mb-3" controlId="portraitFile">
                    <Form.Label>Portrait Source</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
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
