import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Form, Alert } from "react-bootstrap";

const MarksComponent = () => {
    const { id } = useParams();
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalScores, setTotalScores] = useState({});

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${id}/marks`);
                setMarks(response.data);
            } catch (error) {
                console.error("Error fetching marks", error);
                setError("Error fetching marks");
            } finally {
                setLoading(false);
            }
        };

        fetchMarks();
    }, [id]);

    useEffect(() => {
        const calculateTotalScores = () => {
            const newTotalScores = {};
            marks.forEach(mark => {
                const total = mark.marks.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
                newTotalScores[mark.subjectId] = total;
            });
            setTotalScores(newTotalScores);
        };

        calculateTotalScores();
    }, [marks]);

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
                    {marks.length === 0 ? (
                        <Alert variant="warning">No marks found for this student.</Alert>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Scores</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marks.map(mark => (
                                    <tr key={mark.subjectId}>
                                        <td>{mark.subject}</td>
                                        <td>
                                            <Row>
                                                {mark.marks.map((score, index) => (
                                                    <Col key={`${mark.subjectId}_${index}`}>
                                                        <Form.Control
                                                            type="number"
                                                            value={score}
                                                            readOnly
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </td>
                                        <td>{totalScores[mark.subjectId]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MarksComponent;
