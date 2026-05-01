import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, fetchOwner } from './store/userSlice';
import Dashboard from './components/Dashboard';

function App() {
  const dispatch = useDispatch();
  const { data: user, status } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchOwner());
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="spinner" style={{ margin: 'auto', width: '40px', height: '40px' }}></div>;
  }

  if (status === 'failed') {
    return <div className="text-error" style={{textAlign: 'center', marginTop: '2rem'}}>Failed to load user data. Is the backend running?</div>;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Payment Portal</h1>
        <p>Welcome back, {user?.name || 'Guest'}. Manage your payments and history.</p>
      </div>
      <Dashboard />
    </div>
  );
}

export default App;
