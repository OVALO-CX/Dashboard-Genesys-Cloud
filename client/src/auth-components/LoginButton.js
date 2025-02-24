import React from 'react';
import { useAuth } from '../context/AuthProvider';

const LoginButton = () => {
  const { login } = useAuth();

  return (
    <button onClick={login} style={styles.button}>
      Se connecter avec Genesys Cloud
    </button>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0073e6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default LoginButton;
