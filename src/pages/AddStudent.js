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
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      showAlertMessage('danger', 'An error occurred while fetching grades. Please try again later.');
    }
  };

  const handleFileSelect = (file) => {
    setPortraitFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName || !grade || !email || !password) {
      showAlertMessage('danger', 'Please fill in all fields');
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

      showAlertMessage('success', 'Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      showAlertMessage('danger', 'An error occurred while adding the student. Please try again later.');
    }
  };

  const showAlertMessage = (variant, message) => {
    setAlertVariant(variant);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="container">
      <h2>Add Student</h2>
      {showAlert && (
        <Alert variant={alertVariant} onClose={handleAlertClose} dismissible>
          {alertMessage}
        </Alert>
      )}
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
            as="select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
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

        <Button variant="outline-primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddStudent;
