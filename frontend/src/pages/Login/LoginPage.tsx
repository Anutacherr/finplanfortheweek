import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import './LoginPage.css';
import '../../styles/common.css'; 

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({username, password});
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-page">
            <h1>Авторизация</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Логин:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn add" type="submit">Войти</button>
            </form>
            <p>
                Нет аккаунта?{' '}
                <button onClick={() => navigate('/register')} className="link-button">
                    Зарегестрироваться
                </button>
            </p>
        </div>
    );
};

export default LoginPage;