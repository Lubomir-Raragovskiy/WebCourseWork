import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ControlPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const deleteUser = async (uid) => {
      setError('');
      try {
        const response = await axios.delete(`http://localhost:5000/api/users/${uid}`);
        fetchUsers();
      } catch (error) {
        setError(error.message);
      }
    };
  
    const updateUserRole = async (uid, role) => {
      setError('');
      try {
        const response = await axios.post(`http://localhost:5000/api/users/${uid}/role`, { role });
        fetchUsers();
      } catch (error) {
        setError(error.message);
      }
    };
  
    return (
      <div className="container mt-4">
          <h2>Admin Control Panel</h2>
          <Button variant="secondary" onClick={() => navigate('/addUser')} className="mb-3">
              Add New User
          </Button>
          {loading ? (
              <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
              </Spinner>
          ) : error ? (
              <Alert variant="danger">{error}</Alert>
          ) : (
              <Table striped bordered hover>
                  <thead>
                      <tr>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {users.map((user) => (
                          <tr key={user.uid}>
                              <td>{user.email}</td>
                              <td>{user.role || 'user'}</td>
                              <td>
                                  <Button variant="secondary" onClick={() => deleteUser(user.uid)} className="me-2">
                                      Delete
                                  </Button>
                                  <Button variant="secondary" onClick={() => updateUserRole(user.uid, 'admin')} className="me-2">
                                      Make Admin
                                  </Button>
                                  <Button variant="secondary" onClick={() => updateUserRole(user.uid, 'teacher')} className="me-2">
                                      Make Teacher
                                  </Button>
                                  <Button variant="secondary" onClick={() => updateUserRole(user.uid, 'student')}>
                                      Make Student
                                  </Button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </Table>
          )}
      </div>
  );
};

export default ControlPanel;
