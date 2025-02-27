import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('site');
        const response = await axios.get('https://fastshipbackend.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
        toast.error(err.response?.data?.message || 'Failed to fetch users');
      }
    };
    
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // Toggle admin status
  const handleToggleAdmin = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${user._id}`, 
        { isAdmin: !user.isAdmin },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local state
      setUsers(users.map(u => 
        u._id === user._id ? {...u, isAdmin: !u.isAdmin} : u
      ));
      
      toast.success(`User is ${!user.isAdmin ? 'now an admin' : 'no longer an admin'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <div className="text-center py-10">Loading users...</div>;
  
  if (error) return (
    <div className="text-center py-10 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Joined Date</th>
                <th className="py-2 px-4 border-b text-left">Admin</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded ${user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isAdmin ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleAdmin(user)}
                        className="text-blue-500 hover:text-blue-700"
                        title={user.isAdmin ? "Remove admin rights" : "Make admin"}
                      >
                        <FaUserShield />
                      </button>
                      <button 
                        onClick={() => window.location.href = `/admin/users/edit/${user._id}`}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;