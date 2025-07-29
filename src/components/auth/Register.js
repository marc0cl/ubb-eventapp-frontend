import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UBB_COLORS } from '../../styles/colors';

const Register = ({
                      registerData,
                      setRegisterData,
                      showPassword,
                      setShowPassword,
                      handleRegister,
                      loading
                  }) => {
    return (
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
                    <p className="text-xs text-gray-500 mt-1">
                        Usa tu correo @alumnos.ubiobio.cl o @ubiobio.cl
                    </p>
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
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength="6"
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
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    <label className="flex items-start">
                        <input type="checkbox" className="mr-2 mt-1" required />
                        <span>
              Acepto los términos y condiciones y la política de privacidad de la Universidad del Bío-Bío
            </span>
                    </label>
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
                    {loading ? 'Registrando...' : 'Crear cuenta'}
                </button>
            </div>
        </form>
    );
};

export default Register;