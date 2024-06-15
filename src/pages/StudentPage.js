import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/authContext';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import PortraitUploader from '../components/PortraitUploader';

function StudentPage() {
  const { id } = useParams();
  const { role, userDetails } = useContext(AuthContext);

  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [uid, setUID] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const [portraitFile, setPortraitFile] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    portraitSrc: '',
    phone: '',
    address: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
  });

  const [editable, setEditable] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${id}`);
        setStudentDetails(response.data);
        setFormData({
          studentName: response.data.studentName,
          grade: response.data.grade,
          portraitSrc: response.data.portraitSrc,
          phone: response.data.phone,
          address: response.data.address,
          guardianName: response.data.guardianName,
          guardianEmail: response.data.guardianEmail,
          guardianPhone: response.data.guardianPhone,
        });

        setUID(response.data.uid);

        const isAdminUser = role === 'admin';
        setIsAdmin(isAdminUser);
        const canEdit = isAdminUser || (userDetails && userDetails.id === id);
        setEditable(canEdit);
      } catch (error) {
        console.error('Error fetching student details', error);
        setError('Error fetching student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, userDetails]);

  useEffect(() => {
    if (uid) {
      const fetchUserEmail = async () => {
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/users/${uid}`);
          setEmail(userResponse.data.email);
        } catch (error) {
          console.error('Error fetching user email', error);
        }
      };

      fetchUserEmail();
    }
  }, [uid]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesResponse = await axios.get('http://localhost:5000/api/grades');
        setGrades(gradesResponse.data);
      } catch (error) {
        console.error('Error fetching grades', error);
      }
    };

    fetchGrades();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    setPortraitFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedData = { ...formData };
  
    if (portraitFile) {
      const fileData = new FormData();
      fileData.append('file', portraitFile);
  
      try {
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', fileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (studentDetails?.portraitSrc) {
          const oldFileName = studentDetails.portraitSrc.split('/').pop();
          await axios.delete(`http://localhost:5000/api/delete`, {
            data: { fileName: `portraits/${oldFileName}` }
          });
        }
  
        updatedData.portraitSrc = uploadResponse.data.fileUrl;
      } catch (error) {
        console.error('Error uploading or deleting portrait', error);
        setErrorMessage('Error updating student details');
        return;
      }
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/students/${id}`, updatedData);
  
      if (email) {
        await axios.put(`http://localhost:5000/api/users/${uid}/${email}`);
      }
  
      setStudentDetails(response.data);
      setSuccessMessage('Student details updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating student details', error);
      setErrorMessage('Error updating student details');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <img
            src={studentDetails?.portraitSrc}
            alt={`${studentDetails?.studentName}'s portrait`}
            className="img-fluid rounded user-page-img"
          />
        </Col>
        <Col md={8}>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isAdmin}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="studentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                disabled={!isAdmin}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="grade">
              <Form.Label>Grade</Form.Label>
              <Form.Select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                disabled={!isAdmin}
                required
              >
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.name}>
                    {grade.grade}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="guardianName">
              <Form.Label>Guardian Name</Form.Label>
              <Form.Control
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="guardianEmail">
              <Form.Label>Guardian Email</Form.Label>
              <Form.Control
                type="email"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="guardianPhone">
              <Form.Label>Guardian Phone</Form.Label>
              <Form.Control
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                disabled={!editable}
              />
            </Form.Group>
            <PortraitUploader onFileSelect={handleFileSelect} disabled={!editable} />
            {editable && (
              <Button variant="outline-primary" type="submit">
                Update
              </Button>
            )}
          </Form>
          {!editable && (
            <div>
              <p>You do not have permission to edit this student's details.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default StudentPage;
