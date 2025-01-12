"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, email };

    try {
      console.log('Sending data:', userData);

      const response = await axios.post('/api/users', userData);

      console.log('User created:', response.data);
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    // Defina uma função assíncrona
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users'); // Use GET para buscar dados
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
      }
    };

    // Chame a função assíncrona
    fetchUsers();
  }, []); // Dependência vazia para executar apenas uma vez

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>

      <h2 className="mt-8 text-2xl">Users</h2>
      <ul>
        {users.map((user, idx) => (
          <li key={idx} className="mt-2">
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
