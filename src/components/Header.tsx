"use client"
import { useState } from "react";
import Link from "next/link";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <header className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Fit Gate</h1>
                <button 
                    className="md:hidden p-2 focus:outline-none" 
                    onClick={toggleMenu}
                >
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <nav className={`md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'} absolute md:static bg-gray-900 w-full md:w-auto top-full left-0 z-40`}>
                    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0">
                        <li>
                            <Link href="/" className="hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <Link href="/checkin" className="hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
                                Check-in
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin" className="hover:text-gray-400" onClick={() => setIsMenuOpen(false)}>
                                Administrador
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
