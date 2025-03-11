'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }

        try {
            const response = await fetch('http://10.225.100.168/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // เพื่อให้ cookie ทำงาน
            });

            if (response.status === 201) {
                localStorage.setItem('userEmail', email);
                router.push('/menu');
				router.refresh();
            } else {
                setError('Invalid email or password.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={handleEmailChange}
                        className="p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={handlePasswordChange}
                        className="p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Login
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Don't have an account? 
                    <Link href="/register" className="text-blue-500 hover:underline"> Register</Link>
                </p>
            </div>
        </div>
    );
}
