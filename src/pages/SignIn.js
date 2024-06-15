import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            setEmail('');
            setPassword('');

            navigate("/");

        } catch (error) {
            console.error('Error signing in: ', error);

            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/user-disabled':
                    setError('User account is disabled');
                    break;
                case 'auth/user-not-found':
                    setError('User not found');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password');
                    break;
                default:
                    setError('An error occurred while signing in. Please try again later.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Sign In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>

                <Button variant="outline-primary" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Submit'}
                </Button>
            </Form>
        </div>
    );
};

export default SignInForm;
