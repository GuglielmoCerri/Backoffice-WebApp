import './style/App.css';
import Login from './Login';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/analytics');
    }
  }, [navigate]);

  return (
    <div className="App">
      {!isAuthenticated && <Login />}
    </div>
  );
}

export default App;
