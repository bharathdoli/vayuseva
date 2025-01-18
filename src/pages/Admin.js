import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users data when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');  // Endpoint for fetching users
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`); // Endpoint to delete a user
      setUsers(users.filter((user) => user._id !== userId));  // Update local state
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);  // Navigate to other pages
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="user-list">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleNavigate(`/admin/edit/${user._id}`)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button onClick={() => handleNavigate('/admin/create')}>Create New User</button>
    </div>
  );
};

export default Admin;
