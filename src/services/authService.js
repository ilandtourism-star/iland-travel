// URL Backend Relative (Proxy in Dev, Same Origin in Prod)
const API_URL = '/api/v1';
import { secureFetch } from '../lib/api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await secureFetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                skipErrorHandling: true, // Biarkan authService handle error statusses
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, user: data.user, message: data.message };
            } else {
                return { success: false, message: data.message || 'Log masuk gagal' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Ralat sambungan server' };
        }
    },

    // Fungsi Register
    register: async (username, email, password) => {
        try {
            const response = await secureFetch(`${API_URL}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                skipErrorHandling: true, // Elak override error backend dengan exception generik
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, user: data.user, message: data.message };
            } else {
                return { success: false, message: data.message || 'Pendaftaran gagal' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Ralat sambungan server' };
        }
    },

    // Fungsi Login Social (Simulasi)
    socialLogin: async (provider) => {
        try {
            // Simulasi email dari provider
            const email = `user_${provider.toLowerCase()}_${Math.floor(Math.random() * 1000)}@example.com`;
            const username = `User ${provider}`;

            const response = await secureFetch(`${API_URL}/auth/social-login`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    provider,
                    email,
                    username
                })
            });

            const data = await response.json();

            console.log("AuthService Response:", response.status, response.ok, data);

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Gagal login social.'
                };
            }

            return { success: true, user: data.user, message: data.message };
        } catch (error) {
            console.error('Social login error:', error);
            return {
                success: false,
                message: error.message || 'Gagal login social.',
                data: { stack: error.stack } // Provide more debug info
            };
        }
    },

    // Fungsi Logout
    logout: async () => {
        try {
            await secureFetch(`${API_URL}/auth/logout`, {
                method: 'POST', // Changed from GET to POST
                credentials: 'include'
            });
            return true;
        } catch (err) {
            return false;
        }
    },

    // Fungsi Test Secret (Untuk semak jika user dah login)
    checkAuth: async () => {
        try {
            const response = await secureFetch(`${API_URL}/secret`, {
                credentials: 'include'
            });
            if (response.status === 200) {
                return true; // User valid
            }
            return false;
        } catch (err) {
            return false;
        }
    }
};
