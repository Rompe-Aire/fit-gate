"use client";
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    surname: string;
    phone: string;
    dni: string;
    hasAccess: boolean;
    expirationDate: string;
    remainingDays: number;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState({ name: '', surname: '', phone: '', dni: '', expirationDate: '', remainingDays: 0 });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        const currentDate = new Date();
        
        const updatedUsers = data.map((user: User) => {
            const expirationDate = new Date(user.expirationDate);
            const daysDifference = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
            const hasAccess = daysDifference > 0;

            return {
                ...user,
                hasAccess,
                remainingDays: hasAccess ? daysDifference : 0
            };
        });
        
        setUsers(updatedUsers);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            await fetch('/api/users', {
                method: 'PUT',
                body: JSON.stringify({ id: editingUser.id, ...form }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    remainingDays: calculateRemainingDays(form.expirationDate),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        setForm({ name: '', surname: '', phone: '', dni: '', expirationDate: '', remainingDays: 0 });
        setEditingUser(null);
        fetchUsers();
        setActiveTab('list');
    };

    const calculateRemainingDays = (expirationDate: string) => {
        const currentDate = new Date();
        const expiration = new Date(expirationDate);
        const daysDifference = Math.ceil((expiration.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        return daysDifference >= 0 ? daysDifference : 0;
    };

    const editUser = (user: User) => {
        setEditingUser(user);
        setForm({ name: user.name, surname: user.surname, phone: user.phone, dni: user.dni, expirationDate: user.expirationDate.split('T')[0], remainingDays: user.remainingDays });
        setActiveTab('form');
    };

    const deleteUser = async (id: number) => {
        await fetch('/api/users', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetchUsers();
    };

    return (
        <main className="flex min-h-svh pt-14 bg-gray-800 text-gray-100">
            <div className="w-full p-5 overflow-auto">
                <h2 className="text-lg font-semibold mb-4">Administración de Usuarios</h2>
                <div className="mb-4">
                    <button
                        className={`mr-4 py-2 px-4 rounded ${activeTab === 'list' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`} // Cambiado a mr-4
                        onClick={() => setActiveTab('list')}
                    >
                        Lista de Usuarios
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${activeTab === 'form' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`} // Cambiado a mr-4
                        onClick={() => {
                            setActiveTab('form');
                            setEditingUser(null);
                            setForm({ name: '', surname: '', phone: '', dni: '', expirationDate: '', remainingDays: 0 });
                        }}
                    >
                        Agregar/Modificar Usuario
                    </button>
                </div>

                {activeTab === 'list' && (
                    <div className="overflow-x-auto">
                        <h2 className="text-lg font-semibold mb-5">Lista de Usuarios</h2>
                        <table className="min-w-full bg-gray-900 shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="py-2 px-4 border">Nombre</th>
                                    <th className="py-2 px-4 border">Apellido</th>
                                    <th className="py-2 px-4 border">Teléfono</th>
                                    <th className="py-2 px-4 border">DNI</th>
                                    <th className="py-2 px-4 border">Acceso</th>
                                    <th className="py-2 px-4 border">Días Restantes</th>
                                    <th className="py-2 px-4 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-800">
                                        <td className="py-2 px-4 border">{user.name}</td>
                                        <td className="py-2 px-4 border">{user.surname}</td>
                                        <td className="py-2 px-4 border">{user.phone}</td>
                                        <td className="py-2 px-4 border">{user.dni}</td>
                                        <td className="py-2 px-4 border">{user.hasAccess ? 'Sí' : 'No'}</td>
                                        <td className="py-2 px-4 border">{user.remainingDays}</td>
                                        <td className="py-2 px-4 border">
                                            <button className="bg-yellow-500 text-gray-900 px-2 py-1 rounded hover:bg-yellow-600 mr-2" onClick={() => editUser(user)}>Editar</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deleteUser(user.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'form' && (
                    <div className="mt-5">
                        <h2 className="text-lg font-semibold mb-4">{editingUser ? 'Modificar Usuario' : 'Agregar Usuario'}</h2>
                        <form onSubmit={handleSubmit} className="bg-gray-900 p-5 rounded shadow">
                            <label className="block mb-2" htmlFor="name">Nombre:</label>
                            <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} className="border rounded w-full p-2 mb-4 bg-gray-800 text-gray-100" required />

                            <label className="block mb-2" htmlFor="surname">Apellido:</label>
                            <input type="text" id="surname" name="surname" value={form.surname} onChange={handleInputChange} className="border rounded w-full p-2 mb-4 bg-gray-800 text-gray-100" required />

                            <label className="block mb-2" htmlFor="phone">Teléfono:</label>
                            <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleInputChange} className="border rounded w-full p-2 mb-4 bg-gray-800 text-gray-100" required />

                            <label className="block mb-2" htmlFor="dni">DNI:</label>
                            <input type="text" id="dni" name="dni" value={form.dni} onChange={handleInputChange} className="border rounded w-full p-2 mb-4 bg-gray-800 text-gray-100" required />

                            <label className="block mb-2" htmlFor="expirationDate">Fecha de Vencimiento:</label>
                            <input type="date" id="expirationDate" name="expirationDate" value={form.expirationDate} onChange={handleInputChange} className="border rounded w-full p-2 mb-4 bg-gray-800 text-gray-100" required />

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                {editingUser ? 'Modificar Usuario' : 'Agregar Usuario'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
