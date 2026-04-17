import { authService } from '../services/authService';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { secureFetch } from '../lib/api';
import { useToast } from '../components/common/Toast';

const SignInOrCreateAccount = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('mode') === 'register') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location]);

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        const result = await authService.socialLogin(provider);

        if (result.success) {
            toast.success(result.message);
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }
            const params = new URLSearchParams(location.search);
            const redirect = params.get('redirect');
            if (redirect) navigate(redirect);
            else navigate('/');
        } else {
            console.error("Login Failed Detail:", result);
            toast.error('Failed: ' + result.message);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');

        if (isLogin) {
            // LOGIN LOGIC
            // Use 'email' state as username/email field
            const result = await authService.login(email, password);
            if (result.success) {
                toast.success(result.message || 'Login Successful!');
                localStorage.setItem('user', JSON.stringify(result.user));
                const user = result.user;

                if (redirect) {
                    navigate(redirect);
                } else {
                    if (user.role === 'partner') navigate('/partner/activity-dashboard');
                    else if (user.role === 'admin') navigate('/admin/dashboard');
                    else navigate('/');
                }
            } else {
                toast.error(result.message || 'Login Failed');
            }
        } else {
            // REGISTER LOGIC
            const result = await authService.register(username, email, password);
            if (result.success) {
                toast.success(result.message || 'Registration Successful! You have been logged in.');
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/');
            } else {
                toast.error(result.message || 'Registration Failed');
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: '#f5f7fa',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '420px',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#2a2a2e',
                    marginBottom: '8px',
                    textAlign: 'center'
                }}>
                    {isLogin ? 'Sign in or create an account' : 'Create an Account'}
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: '#737373',
                    marginBottom: '32px',
                    lineHeight: 1.4,
                    textAlign: 'center'
                }}>
                    {isLogin ? 'Sign in with your email address or social media to unlock member-only deals.' : 'Join us to unlock exclusive deals and manage your bookings.'}
                </p>

                <form
                    action={isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register'}
                    method="POST"
                    onSubmit={handleSubmit}
                >
                    {!isLogin && (
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="username" style={{ fontSize: '14px', fontWeight: 600, color: '#2a2a2e', display: 'block', marginBottom: '8px' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Choose a username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#2a2a2e', display: 'block', marginBottom: '8px' }}>
                            Email Address {isLogin && 'or Username'}
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder={isLogin ? "Email address or username" : "Enter your email"}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 600, color: '#2a2a2e', display: 'block', marginBottom: '8px' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            width: '100%',
                            padding: '12px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '30px 0',
                    color: '#737373',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                }}>
                    <div style={{ flex: 1, borderBottom: '1px solid #e0e0e0' }}></div>
                    <span style={{ padding: '0 10px' }}>or {isLogin ? 'sign in' : 'sign up'} with</span>
                    <div style={{ flex: 1, borderBottom: '1px solid #e0e0e0' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="social-btn" style={socialBtnStyle} onClick={() => handleSocialLogin('Google')}>
                        <svg viewBox="0 0 48 48" style={{ width: '20px', height: '20px', marginRight: '12px' }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                        Google
                    </button>
                    <button className="social-btn" style={socialBtnStyle} onClick={() => handleSocialLogin('Facebook')}>
                        <svg viewBox="0 0 48 48" style={{ width: '20px', height: '20px', marginRight: '12px' }}>
                            <path fill="#1877F2" d="M24 0C10.74 0 0 10.74 0 24c0 12 8.77 21.92 20.25 23.7V29.77h-5.26V24h5.26v-5.25c0-5.18 3.09-8.04 7.8-8.04 2.26 0 4.63.41 4.63.41v5.09h-2.61c-2.57 0-3.37 1.59-3.37 3.23V24h5.73l-.92 5.77h-4.81v17.93C39.23 45.92 48 36 48 24c0-13.26-10.74-24-24-24z" />
                        </svg>
                        Facebook
                    </button>
                    <button className="social-btn" style={socialBtnStyle} onClick={() => handleSocialLogin('Apple')}>
                        <svg viewBox="0 0 384 512" style={{ width: '18px', height: '18px', marginRight: '12px' }}>
                            <path fill="black" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        Apple
                    </button>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none', border: 'none', color: '#007bff',
                            fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none'
                        }}
                    >
                        {isLogin ? 'Create account' : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #dce0e4',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none'
};

const socialBtnStyle = {
    backgroundColor: 'white',
    border: '1px solid #dce0e4',
    color: '#2a2a2e',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '100%'
};

export default SignInOrCreateAccount;
