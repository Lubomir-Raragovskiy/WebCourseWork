import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Form, Button, Alert } from "react-bootstrap";

const MarksAssignmentPage = () => {
  const { grade, subject } = useParams();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students?grade=${grade}`);
        const updatedStudents = response.data.map(student => ({
          ...student,
          scores:(student.marks && student.marks[subject] && student.marks[subject].scores) ? student.marks[subject].scores : []
        }));
        setStudents(updatedStudents);
        setSuccessMessage("");
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching students", error);
        setError("Error fetching students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [grade, subject]);

  const handleAddMark = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, scores: [...student.scores, ""] } : student
      )
    );
  };

  const handleRemoveMark = (studentId, index) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, scores: student.scores.filter((_, i) => i !== index) } : student
      )
    );
  };

  const handleMarkChange = (e, studentId, index) => {
    const { value } = e.target;
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, scores: student.scores.map((score, i) => (i === index ? value : score)) } : student
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        students.map(async (student) => {
          await axios.put(`http://localhost:5000/api/students/${student.id}/marks`, {
            subject,
            scores: student.scores,
          });
        })
      );
      setSuccessMessage("Marks updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating marks", error);
      setErrorMessage("Error updating marks");
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
        <Col md={12}>
          {successMessage && (
            <Alert variant="success">{successMessage}</Alert>
          )}
          {errorMessage && (
            <Alert variant="danger">{errorMessage}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.studentName}</td>
                    <td>
                      <Row>
                        {student.scores.map((score, index) => (
                          <Col key={index}>
                            <Form.Control
                              type="number"
                              value={score}
                              onChange={(e) => handleMarkChange(e, student.id, index)}
                              className="mr-2"
                            />
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveMark(student.id, index)}
                            >
                              Remove
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleAddMark(student.id)}
                      >
                        Add Mark
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="outline-primary" type="submit">
              Update All Marks
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MarksAssignmentPage;
