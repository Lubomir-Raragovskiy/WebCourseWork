import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../utils/authContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { role, userDetails, loading } = useContext(AuthContext);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!loading && ((role === 'student' || role === 'teacher') ? userDetails : true)) {
            setIsReady(true);
        }
    }, [loading, role, userDetails]);

    if (!isReady) {
        return <div>Loading...</div>;
    }

    if (role === 'student') {
        return <Navigate to={`/students/${userDetails.id}`} />;
    } else if (role === 'teacher') {
        return <Navigate to={`/teachers/${userDetails.id}`} />;
    } else if (role === 'admin') {
        return <Navigate to="/controlPanel" />;
    } else {
        return <Navigate to="/signIn" />;
    }
};

export default Home;
