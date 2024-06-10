import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TeacherPage = () => {
    const { id } = useParams();
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teachers/${id}`);
                setTeacherDetails(response.data);
            } catch (error) {
                setError('Error fetching teacher details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!teacherDetails) {
        return <div>No teacher details found.</div>;
    }

    return (
        <div className="container mt-4">
            <h1>{teacherDetails.name}</h1>
            <p>Subjects: {teacherDetails.subjects.join(', ')}</p>
        </div>
    );
};

export default TeacherPage;