import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function StudentPage() {
    const { id } = useParams();
    const [studentDetails, setStudentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/${id}`);
                setStudentDetails(response.data);
            } catch (error) {
                setError('Error fetching student details');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{studentDetails.studentName}</h1>
            <p>Grade: {studentDetails.grade}</p>
            {studentDetails.portraitSrc && (
                <img src={studentDetails.portraitSrc} alt={studentDetails.studentName} style={{ width: '400px', height: 'auto' }} />
            )}
        </div>
    );
}

export default StudentPage;
