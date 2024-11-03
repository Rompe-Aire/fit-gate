"use client";
import { useState } from 'react';

const CheckInPage = () => {
    const [dni, setDni] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                body: JSON.stringify({ dni }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setIsError(true);
                setMessage(errorData.message || 'Error desconocido.');
                return;
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (err) {
            console.error('Error al realizar el check-in:', err);
            setIsError(true);
            setMessage('Error al realizar el check-in.');
        }

        setDni('');
    };

    return (
        <main className="flex items-center justify-center min-h-svh pt-14 bg-gray-800 text-gray-100">
            <div className="p-6 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-white text-center">Check-in</h1>
                <form onSubmit={handleCheckIn} className="space-y-4">
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium">DNI</label>
                        <input
                            type="text"
                            id="dni"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring focus:ring-yellow-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-gray-900 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                        Realizar Check-in
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 ${isError ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
};

export default CheckInPage;
