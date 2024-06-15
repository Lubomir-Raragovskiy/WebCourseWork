import React, { useContext } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';


const Menu = () => {
    const { role, currentUser, userDetails } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/')
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <Navbar>
            <Container>
                <Nav className="container-fluid">
                    <Nav.Link href="#" onClick={() => window.history.back()}>Back</Nav.Link>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/students">Students</Nav.Link>
                    <Nav.Link href="/teachers">Teachers</Nav.Link>

                    
                    {role === 'admin' && (
                        <>
                           
                            <Nav.Link href="/grades">Grades</Nav.Link>
                            <Nav.Link href="/controlPanel">Control Panel</Nav.Link>
                        </>
                    )}
                    {role === 'teacher' && (
                        <>
                            <Nav.Link href="/teacherLessons">Lessons</Nav.Link>
                        </>
                    )}
                    {role === 'student' && (
                        <>
                            <Nav.Link href="/studentLessons">Lessons</Nav.Link>
                        </>
                    )}
                    {!currentUser && (
                        <Nav.Link href="/signIn" className="ms-auto">Sign In</Nav.Link>
                    )}
                    {currentUser && (
                            <Nav.Link className="ms-auto" onClick={handleLogout}>
                                Log out
                            </Nav.Link>
                    )}
                    {userDetails && (
                        <Nav.Link className="ms-2">
                            <img src= {userDetails.user.portraitSrc}  
                            alt="User Portrait"
                            className="user-portrait"></img>
                        </Nav.Link>)}


                </Nav>
            </Container>
        </Navbar>
    );
};

export default Menu;
