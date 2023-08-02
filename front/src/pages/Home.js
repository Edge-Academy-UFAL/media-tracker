import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';

export default function Home() {
  const signOut = useSignOut();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/login');
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
