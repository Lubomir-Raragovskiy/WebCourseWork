import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import PortraitUploader from '../components/PortraitUploader';

const AddStudent = () => {
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [grades, setGrades] = useState([]);
  const [portraitFile, setPortraitFile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('An error occurred while fetching grades. Please try again later.');
    }
  };

  const handleFileSelect = (file) => {
    setPortraitFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName || !grade || !email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    setValidationError('');

    try {
      let portraitSrc = '';

      if (portraitFile) {
        const formData = new FormData();
        formData.append('file', portraitFile);

        try {
          const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          portraitSrc = uploadResponse.data.fileUrl;
        } catch (uploadError) {
          console.error('Error uploading portrait:', uploadError);
          setError('Error uploading portrait. Please try again.');
          return;
        }
      }

      try {
        await axios.post('http://localhost:5000/api/students', {
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

        setSuccess('Student added successfully!');
        setError('');
      } catch (apiError) {
        console.error('Error adding student:', apiError);
        if (apiError.response && apiError.response.data && apiError.response.data.message) {
          setError(`Error: ${apiError.response.data.message}`);
        } else {
          setError('Error adding student. Please try again.');
        }
        setSuccess('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Unexpected error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Student</h2>
      {validationError && <Alert variant="warning">{validationError}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="studentName">
          <Form.Label>Student Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="grade">
          <Form.Label>Grade</Form.Label>
          <Form.Control
            as="select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          >
            <option value="">Select grade</option>
            {grades.map(grade => (
              <option key={grade.id} value={grade.grade}>
                {grade.grade}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <PortraitUploader onFileSelect={handleFileSelect} />

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="outline-primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddStudent;
