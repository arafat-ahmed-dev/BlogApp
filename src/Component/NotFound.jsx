import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
            <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <Link 
            to="/"
            className="mt-6 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;