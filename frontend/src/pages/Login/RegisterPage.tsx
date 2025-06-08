import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [role, setRole] = useState<'judge' | 'organizer'>('judge');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await register({username, password});
            navigate('/');
        } catch (err) {
            setError('Registration failed. Username may already be taken.');
        }
    };

    return (
        <div className="register-page">
            <h1>Регистрация</h1>
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
                
                <button className='btn add' type="submit">Зарегестрироваться</button>
            </form>
            <p>
                Есть аккаунт?{' '}
                <button onClick={() => navigate('/login')} className="link-button">
                    Войти
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;