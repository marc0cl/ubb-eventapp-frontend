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

    // Estilos según las especificaciones
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '16px'
        },
        card: {
            width: '100%',
            maxWidth: '480px'
        },
        header: {
            textAlign: 'center',
            marginBottom: '32px'
        },
        logoContainer: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            marginBottom: '16px',
            background: `linear-gradient(135deg, ${UBB_COLORS.primary} 0%, ${UBB_COLORS.primaryDark} 100%)`,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        },
        title: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            lineHeight: '1.2'
        },
        subtitle: {
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5'
        },
        cardContainer: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        },
        tabContainer: {
            display: 'flex',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb'
        },
        tab: {
            flex: 1,
            padding: '20px 24px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
        },
        activeTab: {
            backgroundColor: 'white',
            color: UBB_COLORS.primary,
            borderBottom: `3px solid ${UBB_COLORS.primary}`
        },
        inactiveTab: {
            backgroundColor: 'transparent',
            color: '#6b7280'
        },
        formContainer: {
            padding: '40px 32px'
        },
        alert: {
            marginBottom: '32px',
            padding: '20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500'
        },
        errorAlert: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c'
        },
        successAlert: {
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d'
        },
        formGroup: {
            marginBottom: '36px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
        },
        inputContainer: {
            position: 'relative'
        },
        input: {
            width: '100%',
            padding: '20px 18px',
            paddingLeft: '52px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.2s',
            outline: 'none',
            backgroundColor: 'white',
            lineHeight: '1.5',
            boxSizing: 'border-box'
        },
        inputFocus: {
            borderColor: UBB_COLORS.primary,
            boxShadow: `0 0 0 3px ${UBB_COLORS.primary}20`
        },
        inputIcon: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
        },
        eyeIcon: {
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.2s'
        },
        button: {
            width: '100%',
            padding: '20px 16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            overflow: 'hidden',
            marginTop: '16px'
        },
        primaryButton: {
            backgroundColor: UBB_COLORS.primary,
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        },
        disabledButton: {
            backgroundColor: UBB_COLORS.gray,
            cursor: 'not-allowed',
            opacity: 0.7
        },
        gridCols2: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '12px'
        },
        emailGrid: {
            display: 'flex',
            gap: '12px'
        },
        select: {
            padding: '20px 18px',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            fontSize: '16px',
            backgroundColor: 'white',
            cursor: 'pointer',
            minWidth: '180px',
            lineHeight: '1.5',
            boxSizing: 'border-box'
        },
        radioGroup: {
            display: 'flex',
            gap: '24px',
            marginTop: '12px'
        },
        radioLabel: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#374151'
        },
        radio: {
            marginRight: '8px',
            accentColor: UBB_COLORS.primary
        },
        footer: {
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '24px'
        }
    };

    const handleTabChange = (_e, value) => {
        setTab(value);
        setError('');
        setSuccess('');
    };

    const handleInputFocus = (e) => {
        Object.assign(e.target.style, styles.inputFocus);
    };

    const handleInputBlur = (e) => {
        e.target.style.borderColor = '#d1d5db';
        e.target.style.boxShadow = 'none';
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
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <Calendar color="white" size={36} />
                    </div>
                    <h1 style={styles.title}>
                        Eventos UBB
                    </h1>
                    <p style={styles.subtitle}>
                        Tu calendario universitario en un solo lugar
                    </p>
                </div>

                {/* Card */}
                <div style={styles.cardContainer}>
                    {/* Tabs */}
                    <div style={styles.tabContainer}>
                        <button
                            onClick={() => handleTabChange(null, 0)}
                            style={{
                                ...styles.tab,
                                ...(tab === 0 ? styles.activeTab : styles.inactiveTab)
                            }}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => handleTabChange(null, 1)}
                            style={{
                                ...styles.tab,
                                ...(tab === 1 ? styles.activeTab : styles.inactiveTab)
                            }}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* Form Container */}
                    <div style={styles.formContainer}>
                        {/* Alerts */}
                        {error && (
                            <div style={{...styles.alert, ...styles.errorAlert}}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{...styles.alert, ...styles.successAlert}}>
                                {success}
                            </div>
                        )}

                        {/* Login Form */}
                        {tab === 0 ? (
                            <form onSubmit={handleLogin}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Correo Institucional
                                    </label>
                                    <div style={styles.inputContainer}>
                                        <Mail style={styles.inputIcon} size={20} />
                                        <input
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            style={styles.input}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="tu.correo@alumnos.ubiobio.cl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Contraseña
                                    </label>
                                    <div style={styles.inputContainer}>
                                        <Lock style={styles.inputIcon} size={20} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            style={{...styles.input, paddingRight: '56px'}}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <div
                                            style={styles.eyeIcon}
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.button,
                                        ...(loading ? styles.disabledButton : styles.primaryButton)
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                                            e.target.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = UBB_COLORS.primary;
                                            e.target.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </button>
                            </form>
                        ) : (
                            /* Register Form */
                            <form onSubmit={handleRegister}>
                                <div style={{...styles.gridCols2, marginBottom: '0'}}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Nombre</label>
                                        <input
                                            type="text"
                                            value={registerData.firstName}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    firstName: e.target.value
                                                })
                                            }
                                            style={{...styles.input, paddingLeft: '20px'}}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="Juan"
                                            required
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Apellido</label>
                                        <input
                                            type="text"
                                            value={registerData.lastName}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    lastName: e.target.value
                                                })
                                            }
                                            style={{...styles.input, paddingLeft: '20px'}}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="Pérez"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Nombre de usuario
                                    </label>
                                    <div style={styles.inputContainer}>
                                        <User style={styles.inputIcon} size={20} />
                                        <input
                                            type="text"
                                            value={registerData.username}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    username: e.target.value
                                                })
                                            }
                                            style={styles.input}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="usuario123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Correo Institucional
                                    </label>
                                    <div style={styles.emailGrid}>
                                        <div style={{...styles.inputContainer, flex: 1}}>
                                            <Mail style={styles.inputIcon} size={20} />
                                            <input
                                                type="text"
                                                value={registerData.emailPrefix}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        emailPrefix: e.target.value
                                                    })
                                                }
                                                style={styles.input}
                                                onFocus={handleInputFocus}
                                                onBlur={handleInputBlur}
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
                                            style={styles.select}
                                        >
                                            <option value="alumnos.ubiobio.cl">
                                                @alumnos.ubiobio.cl
                                            </option>
                                            <option value="ubiobio.cl">@ubiobio.cl</option>
                                        </select>
                                    </div>
                                </div>

                                {registerData.emailDomain === 'ubiobio.cl' && (
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>
                                            ¿Eres externo a la universidad?
                                        </label>
                                        <div style={styles.radioGroup}>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="isExternal"
                                                    style={styles.radio}
                                                    checked={registerData.isExternal}
                                                    onChange={() =>
                                                        setRegisterData({
                                                            ...registerData,
                                                            isExternal: true
                                                        })
                                                    }
                                                />
                                                Sí, soy externo
                                            </label>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="isExternal"
                                                    style={styles.radio}
                                                    checked={!registerData.isExternal}
                                                    onChange={() =>
                                                        setRegisterData({
                                                            ...registerData,
                                                            isExternal: false
                                                        })
                                                    }
                                                />
                                                No, pertenezco a UBB
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Contraseña
                                    </label>
                                    <div style={styles.inputContainer}>
                                        <Lock style={styles.inputIcon} size={20} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    password: e.target.value
                                                })
                                            }
                                            style={{...styles.input, paddingRight: '56px'}}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <div
                                            style={styles.eyeIcon}
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Confirmar Contraseña
                                    </label>
                                    <div style={styles.inputContainer}>
                                        <Lock style={styles.inputIcon} size={20} />
                                        <input
                                            type="password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                            style={styles.input}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.button,
                                        ...(loading ? styles.disabledButton : styles.primaryButton)
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = UBB_COLORS.primaryDark;
                                            e.target.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            e.target.style.backgroundColor = UBB_COLORS.primary;
                                            e.target.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p style={styles.footer}>
                    Universidad del Bío-Bío © 2025
                </p>
            </div>
        </div>
    );
};

export default AuthPage;