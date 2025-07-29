import React, { useState } from 'react';
import { Calendar, AlertCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { validateUBBEmail } from '../utils/validators';
import { UBB_COLORS } from '../styles/colors';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        firstName: '',
        lastName: ''
    });

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
            const data = await authService.login(loginData.email, loginData.password);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
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

        if (!validateUBBEmail(registerData.email)) {
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
            const { confirmPassword, ...dataToSend } = registerData;
            const data = await authService.register(dataToSend);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
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

    const handleSubmit = (e) => {
        if (isLogin) {
            handleLogin(e);
        } else {
            handleRegister(e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-4">
                        <div className="rounded-lg p-3" style={{backgroundColor: UBB_COLORS.primary}}>
                            <Calendar className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Portal de Eventos UBB</h1>
                    <p className="text-gray-600 mt-2">Tu calendario universitario en un solo lugar</p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Selector de modo */}
                    <div className="flex">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-center font-medium transition-all ${
                                isLogin
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={isLogin ? {backgroundColor: UBB_COLORS.primary} : {}}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-center font-medium transition-all ${
                                !isLogin
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={!isLogin ? {backgroundColor: UBB_COLORS.primary} : {}}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="p-8">
                        {error && (
                            <div
                                className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2"
                                style={{
                                    borderColor: UBB_COLORS.secondary,
                                    borderWidth: '1px',
                                    borderStyle: 'solid'
                                }}
                            >
                                <AlertCircle className="w-5 h-5 mt-0.5" style={{color: UBB_COLORS.secondary}} />
                                <p className="text-sm" style={{color: UBB_COLORS.secondary}}>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        )}

                        {isLogin ? (
                            // Formulario de Login
                            <form onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Correo Institucional
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
                                                placeholder="tu.correo@alumnos.ubiobio.cl"
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
                                                type={showPassword ? "text" : "password"}
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                                className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            backgroundColor: loading ? UBB_COLORS.gray : UBB_COLORS.primary
                                        }}
                                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = UBB_COLORS.primaryDark)}
                                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = UBB_COLORS.primary)}
                                    >
                                        {loading ? 'Ingresando...' : 'Ingresar'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Formulario de Registro
                            <form onSubmit={handleRegister}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={registerData.firstName}
                                                onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
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
                                                onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
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
                                                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
                                                placeholder="usuario123"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Correo Institucional
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
                                                placeholder="tu.correo@alumnos.ubiobio.cl"
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
                                                type={showPassword ? "text" : "password"}
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                                className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                                                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                                                style={{'--tw-ring-color': UBB_COLORS.primary}}
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
                                            backgroundColor: loading ? UBB_COLORS.gray : UBB_COLORS.primary
                                        }}
                                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = UBB_COLORS.primaryDark)}
                                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = UBB_COLORS.primary)}
                                    >
                                        {loading ? 'Registrando...' : 'Registrarse'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Pie de página */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Universidad del Bío-Bío © 2025
                </p>
            </div>
        </div>
    );
};

export default AuthPage;