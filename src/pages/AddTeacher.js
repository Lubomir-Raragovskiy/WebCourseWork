import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import SubjectsList from '../components/SubjectsSelectableList';
import PortraitUploader from '../components/PortraitUploader';

const AddTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [password, setPassword] = useState('');
  const [portraitFile, setPortraitFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleFileSelect = (file) => {
    setPortraitFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || selectedSubjects.length === 0) {
      setValidationError('Please fill in all fields');
      return;
    }

    setValidationError('');

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

      await axios.post('http://localhost:5000/api/teachers', {
        name,
        email,
        subjects: selectedSubjects,
        password,
        portraitSrc
      });

      setName('');
      setEmail('');
      setSelectedSubjects([]);
      setPassword('');
      setPortraitFile(null);

      setSuccess('Teacher added successfully!');
      setError('');
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError('Error adding teacher. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Teacher</h2>
      {validationError && <Alert variant="warning">{validationError}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter teacher's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter teacher's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="subjects">
          <Form.Label className="mb-3">Subjects</Form.Label>
          <SubjectsList
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
          />
        </Form.Group>

        <PortraitUploader onFileSelect={handleFileSelect} />

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddTeacher;
