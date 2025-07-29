import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { UBB_COLORS } from '../styles/colors';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Bienvenido al Portal de Eventos UBB</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => navigate('/calendar')}
                        className="text-white py-4 rounded-lg font-semibold"
                        style={{ backgroundColor: UBB_COLORS.primary }}
                    >
                        Calendario Personal
                    </button>
                    <button
                        onClick={() => navigate('/events')}
                        className="text-white py-4 rounded-lg font-semibold"
                        style={{ backgroundColor: UBB_COLORS.primary }}
                    >
                        Eventos
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-white py-4 rounded-lg font-semibold"
                        style={{ backgroundColor: UBB_COLORS.primary }}
                    >
                        Perfil
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
