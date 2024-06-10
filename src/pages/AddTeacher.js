import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const AddTeacher = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [password, setPassword] = useState('');
  const [portraitFile, setPortraitFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('An error occurred while fetching subjects. Please try again later.');
    }
  };

  const handleSubjectClick = (e, selectedSubject) => {
    e.preventDefault(); // Prevent default form submission behavior
    e.stopPropagation(); // Stop event from bubbling up

    let updatedSelectedSubjects = [...selectedSubjects];
    if (updatedSelectedSubjects.includes(selectedSubject)) {
      updatedSelectedSubjects = updatedSelectedSubjects.filter(
        (subject) => subject !== selectedSubject
      );
    } else {
      updatedSelectedSubjects.push(selectedSubject);
    }
    setSelectedSubjects(updatedSelectedSubjects);
  };

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
    console.log('Form submitted'); // Debug log

    if (!name || !email || !password || selectedSubjects.length === 0) {
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

      alert('Teacher added successfully!');
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
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '5px', padding: '10px' }}>
            <ListGroup>
              {subjects.map((subject) => (
                <ListGroup.Item
                  key={subject.id}
                  action
                  as="button" // Use as="button" to prevent form submission
                  onClick={(e) => handleSubjectClick(e, subject.name)}
                  active={selectedSubjects.includes(subject.name)}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '5px',
                    backgroundColor: selectedSubjects.includes(subject.name) ? '#d3f9d8' : 'white',
                    border: '1px solid #ced4da',
                    borderRadius: '5px',
                    padding: '10px'
                  }}
                >
                  {subject.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Form.Group>

        <Form.Group controlId="portrait">
          <Form.Label>Portrait</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddTeacher;
