import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';

function PrivateRoute({ element, allowedRoles }) {
    const { role, loading } = useContext(AuthContext);
    const [isReady, setIsReady] = useState(false);

   
    useEffect(() => {
        if (!loading) {
            setIsReady(true);
        }
    }, [loading]);


    if (!isReady) {
        return null;
    }

    return allowedRoles.includes(role) ? element : <Navigate to="/accessDenied" />;
}

export default PrivateRoute;
