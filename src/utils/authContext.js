import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const idTokenResult = await user.getIdTokenResult();
                    const userRole = idTokenResult.claims.role;
                    setRole(userRole);

                    if (userRole === 'teacher' || userRole === 'student') {
                        const response = await axios.get(`http://localhost:5000/api/getUserDetails/${user.uid}`, 
                            { params: { role: userRole } });
                        setUserDetails(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching user role or details:', error);
                    setRole(null);
                    setUserDetails(null);
                }
            } else {
                setCurrentUser(null);
                setRole(null);
                setUserDetails(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, role, userDetails, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
