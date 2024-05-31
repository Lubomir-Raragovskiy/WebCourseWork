import React, { useState} from 'react';
import { Button, Form } from 'react-bootstrap';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            setEmail('');
            setPassword('');

            navigate("/");

            
        } catch (error) {
            console.error('Error signing in: ', error);
            alert('An error occurred while signing in. Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Sign In</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="outline-secondary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default SignInForm;
