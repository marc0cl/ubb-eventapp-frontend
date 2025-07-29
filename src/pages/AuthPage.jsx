import React, { useState } from 'react';
import { Calendar, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { validateUBBEmail } from '../utils/validators';
import { UBB_COLORS } from '../styles/colors';

const AuthPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0); // 0 login, 1 register
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const [registerData, setRegisterData] = useState({
        emailPrefix: '',
        emailDomain: 'alumnos.ubiobio.cl',
        isExternal: false,
        password: '',
        confirmPassword: '',
        username: '',
        firstName: '',
        lastName: ''
    });

    const handleTabChange = (_e, value) => {
        setTab(value);
        setError('');
        setSuccess('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateUBBEmail(loginData.email)) {
            setError('Debes usar un correo institucional UBB (@alumnos.ubiobio.cl o @ubiobio.cl)');
            return;
        }

        setLoading(true);

        try {
            const data = await authService.login(
                loginData.email,
                loginData.password
            );
            const accessToken =
                data.accessToken || data.access_token || data.token || '';
            const refreshToken =
                data.refreshToken || data.refresh_token || '';
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            if (onLogin) onLogin();
            setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
            } else {
                setError('Error de conexión. Por favor, intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const email = `${registerData.emailPrefix}@${registerData.emailDomain}`;

        if (!validateUBBEmail(email)) {
            setError('Debes usar un correo institucional UBB (@alumnos.ubiobio.cl o @ubiobio.cl)');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (registerData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, emailPrefix, emailDomain, isExternal, ...rest } = registerData;
            const dataToSend = {
                ...rest,
                email,
                isExternal
            };
            const data = await authService.register(dataToSend);
            const accessToken =
                data.accessToken || data.access_token || data.token || '';
            const refreshToken =
                data.refreshToken || data.refresh_token || '';
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            if (onLogin) onLogin();
            setSuccess('¡Registro exitoso! Redirigiendo...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError('El correo o usuario ya está registrado.');
            } else {
                setError('Error de conexión. Por favor, intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
                padding: '16px'
            }}
        >
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            marginBottom: '8px',
                            backgroundColor: UBB_COLORS.primary
                        }}
                    >
                        <Calendar color="white" size={32} />
                    </div>
                    <h1
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            marginBottom: '4px'
                        }}
                    >
                        Portal de Eventos UBB
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Tu calendario universitario en un solo lugar
                    </p>
                </div>

                <div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <button
                            onClick={() => handleTabChange(null, 0)}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: tab === 0 ? UBB_COLORS.primary : 'transparent',
                                color: tab === 0 ? 'white' : '#6b7280',
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => handleTabChange(null, 1)}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: tab === 1 ? UBB_COLORS.primary : 'transparent',
                                color: tab === 1 ? 'white' : '#6b7280',
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Registrarse
                        </button>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {error && (
                            <div
                                style={{
                                    marginBottom: '16px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    color: '#b91c1c',
                                    fontSize: '14px'
                                }}
                            >
                                {error}
                            </div>
                        )}
                        {success && (
                            <div
                                style={{
                                    marginBottom: '16px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: '#d1fae5',
                                    border: '1px solid #a7f3d0',
                                    color: '#047857',
                                    fontSize: '14px'
                                }}
                            >
                                {success}
                            </div>
                        )}

                        {tab === 0 ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Institucional
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: loading
                                            ? UBB_COLORS.gray
                                            : UBB_COLORS.primary
                                    }}
                                    onMouseEnter={(e) =>
                                        !loading &&
                                        (e.currentTarget.style.backgroundColor = UBB_COLORS.primaryDark)
                                    }
                                    onMouseLeave={(e) =>
                                        !loading &&
                                        (e.currentTarget.style.backgroundColor = UBB_COLORS.primary)
                                    }
                                >
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={registerData.firstName}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    firstName: e.target.value
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={registerData.lastName}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    lastName: e.target.value
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de usuario
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={registerData.username}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    username: e.target.value
                                                })
                                            }
                                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            placeholder="usuario123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Institucional
                                    </label>
                                    <div className="flex">
                                        <div className="relative flex-grow">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={registerData.emailPrefix}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        emailPrefix: e.target.value
                                                    })
                                                }
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                                placeholder="tu.correo"
                                                required
                                            />
                                        </div>
                                        <select
                                            value={registerData.emailDomain}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    emailDomain: e.target.value,
                                                    isExternal: false
                                                })
                                            }
                                            className="ml-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                        >
                                            <option value="alumnos.ubiobio.cl">
                                                @alumnos.ubiobio.cl
                                            </option>
                                            <option value="ubiobio.cl">@ubiobio.cl</option>
                                        </select>
                                    </div>
                                </div>

                                {registerData.emailDomain === 'ubiobio.cl' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ¿Eres externo?
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isExternal"
                                                    className="mr-2"
                                                    checked={registerData.isExternal}
                                                    onChange={() =>
                                                        setRegisterData({
                                                            ...registerData,
                                                            isExternal: true
                                                        })
                                                    }
                                                />
                                                Sí
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="isExternal"
                                                    className="mr-2"
                                                    checked={!registerData.isExternal}
                                                    onChange={() =>
                                                        setRegisterData({
                                                            ...registerData,
                                                            isExternal: false
                                                        })
                                                    }
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    password: e.target.value
                                                })
                                            }
                                            className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': UBB_COLORS.primary }}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: loading
                                            ? UBB_COLORS.gray
                                            : UBB_COLORS.primary
                                    }}
                                    onMouseEnter={(e) =>
                                        !loading &&
                                        (e.currentTarget.style.backgroundColor = UBB_COLORS.primaryDark)
                                    }
                                    onMouseLeave={(e) =>
                                        !loading &&
                                        (e.currentTarget.style.backgroundColor = UBB_COLORS.primary)
                                    }
                                >
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <p
                    style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'center',
                        marginTop: '16px'
                    }}
                >
                    Universidad del Bío-Bío © 2025
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
