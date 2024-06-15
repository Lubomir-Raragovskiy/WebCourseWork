import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../utils/authContext';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import SubjectsList from '../components/SubjectsSelectableList';
import PortraitUploader from '../components/PortraitUploader';

const TeacherPage = () => {
    const { id, userDetails } = useParams();
    const { role } = useContext(AuthContext);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [portraitFile, setPortraitFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [email, setEmail] = useState('');
    const [uid, setUID] = useState(null);

    const [editable, setEditable] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teachers/${id}`);
                setTeacherDetails(response.data);
                setFormData({
                    name: response.data.name,
                    phone: response.data.phone,
                });
                setUID(response.data.uid);
                setSelectedSubjects(response.data.subjects);
                const isAdminUser = role === "admin";
                setIsAdmin(isAdminUser);
                const canEdit = isAdminUser || (userDetails && userDetails.id === id);
                setEditable(canEdit);
            } catch (error) {
                setError('Error fetching teacher details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [id, role, userDetails]);

    useEffect(() => {
        if (uid) {
            const fetchUserEmail = async () => {
                try {
                    const userResponse = await axios.get(`http://localhost:5000/api/users/${uid}`);
                    setEmail(userResponse.data.email || '');
                } catch (error) {
                    console.error("Error fetching user email", error);
                }
            };

            fetchUserEmail();
        }
    }, [uid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileSelect = (file) => {
        setPortraitFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = { ...formData, subjects: selectedSubjects };

        if (portraitFile) {
            const fileData = new FormData();
            fileData.append('file', portraitFile);

            try {
                const uploadResponse = await axios.post('http://localhost:5000/api/upload', fileData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                updatedData.portraitSrc = uploadResponse.data.fileUrl;
            } catch (error) {
                setErrorMessage("Error uploading portrait");
                return;
            }
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/teachers/${id}`, updatedData);
            setTeacherDetails(response.data);
            setSuccessMessage("Teacher details updated successfully!");
            setErrorMessage("");

            if (email) {
                await axios.put(`http://localhost:5000/api/users/${uid}/${email}`);
            }
        } catch (error) {
            setErrorMessage("Error updating teacher details");
            setSuccessMessage("");
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
                        src={teacherDetails?.portraitSrc}
                        alt={`${teacherDetails?.name}'s portrait`}
                        className="img-fluid rounded user-page-img"
                    />
                </Col>
                <Col md={8}>
                    {successMessage && (
                        <Alert variant="success" className="mt-3">
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert variant="danger" className="mt-3">
                            {errorMessage}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isAdmin}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!editable}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="subjects">
                            <Form.Label>Subjects</Form.Label>
                            <SubjectsList
                                selectedSubjects={selectedSubjects}
                                setSelectedSubjects={setSelectedSubjects}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editable}
                                required
                            />
                        </Form.Group>
                        <PortraitUploader onFileSelect={handleFileSelect} disabled={!editable} />
                        {editable && (
                            <Button variant="outline-primary" type="submit">
                                Update
                            </Button>
                        )}
                        {!editable && (
                            <div>
                                <p>You do not have permission to edit this teacher's details.</p>
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default TeacherPage;
