import React from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UBB_COLORS } from '../../styles/colors';

const Login = ({
                   loginData,
                   setLoginData,
                   showPassword,
                   setShowPassword,
                   handleLogin,
                   loading
               }) => {
    return (
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

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-600">Recordarme</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </a>
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
    );
};

export default Login;