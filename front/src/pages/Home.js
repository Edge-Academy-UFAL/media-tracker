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
    <div className="flex h-full w-full flex-1 items-center flex-col justify-center px-6 py-12 lg:px-8 text-white">
      <div>
        <h1 className="mt-6 text-center text-xl pb-12 text-rose-900">Home</h1>
        <button
          onClick={handleLogout}
          className="text-center justify-center rounded-xl bg-primary-300 px-3 py-4 text-2xl font-semibold leading-6 text-white shadow-sm transition hover:brightness-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
