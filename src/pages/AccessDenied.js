import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div>
            <h1>Access Denied</h1>
            <p>You are not authorized to access this page.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default AccessDenied;