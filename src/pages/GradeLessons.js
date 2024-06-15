import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const GradeLessonsComponent = () => {
    const { gradeId } = useParams();
    const [gradeDetails, setGradeDetails] = useState({});
    const [subjects, setSubjects] = useState({});
    const [allSubjects, setAllSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchGradeDetails();
        fetchSubjects();
        fetchTeachers();
    }, [gradeId]);

    const fetchGradeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/grades/${gradeId}`);
            setGradeDetails(response.data);
            setSubjects(response.data.subjects || {});
        } catch (error) {
            console.error('Error fetching grade details:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/subjects');
            setAllSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleAddSubject = async () => {
        if (newSubject) {
            const updatedSubjects = {
                ...subjects,
                [newSubject]: { name: newSubject, teacherId: selectedTeacher || null }
            };
            try {
                await axios.post(`http://localhost:5000/api/grades/${gradeId}/subjects`, { name: newSubject, teacherId: selectedTeacher });
                setSubjects(updatedSubjects);
                setNewSubject('');
                setSelectedTeacher('');
            } catch (error) {
                console.error('Error adding subject:', error);
            }
        }
    };

    const handleRemoveSubject = async (subjectName) => {
        try {
            const updatedSubjects = { ...subjects };
            delete updatedSubjects[subjectName];
            await axios.delete(`http://localhost:5000/api/grades/${gradeId}/subjects/${subjectName}`);
            setSubjects(updatedSubjects);
        } catch (error) {
            console.error('Error removing subject:', error);
        }
    };

    const handleAssignTeacher = async (teacherId, subjectName) => {
        const subject = subjects[subjectName];

        if (subject) {
            const updatedSubject = {
                ...subject,
                teacherId: teacherId
            };

            const updatedSubjects = {
                ...subjects,
                [subjectName]: updatedSubject
            };

            setSubjects(updatedSubjects);

            try {
                await axios.put(`http://localhost:5000/api/grades/${gradeId}/subjects/${subjectName}`, { teacherId });
            } catch (error) {
                console.error('Error updating subject data:', error);
            }
        }
    };

    return (
        <div>
            <h2>Grade: {gradeDetails.grade}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(subjects).map((subjectId, index) => {
                        const subject = subjects[subjectId];
                        return (
                            <tr key={index}>
                                <td>{subject.name}</td>
                                <td>
                                    <Form.Control as="select" value={subject.teacherId} onChange={(e) => handleAssignTeacher(e.target.value, subjectId)}>
                                        <option value="">Select a teacher</option>
                                        {teachers
                                            .filter(teacher => teacher.subjects.includes(subject.name))
                                            .map(teacher => (
                                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                            ))}
                                    </Form.Control>
                                </td>
                                <td>
                                    <Button variant="outline-secondary" onClick={() => handleRemoveSubject(subjectId)}>Remove</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <Form>
                <Form.Label>Select Subject</Form.Label>
                <Form.Control
                    as="select"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                >
                    <option value="">Select a subject</option>
                    {Object.keys(allSubjects).map(subjectId => {
                        const subject = allSubjects[subjectId];
                        if (!Object.values(subjects).some(s => s.name === subject.name)) {
                            return (
                                <option key={subjectId} value={subject.name}>{subject.name}</option>
                            );
                        }
                        return null;
                    })}
                </Form.Control>

                <Form.Group controlId="formTeacherSelect">
                    <Form.Label>Select Teacher</Form.Label>
                    <Form.Control as="select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                        <option value="">Select a teacher</option>
                        {teachers
                            .filter(teacher => teacher.subjects.includes(newSubject))
                            .map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                            ))}
                    </Form.Control>
                </Form.Group>
                <Button variant="outline-primary" onClick={handleAddSubject}>Add Subject</Button>
            </Form>
        </div>
    );
};

export default GradeLessonsComponent;
