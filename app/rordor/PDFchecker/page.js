import React from 'react';
import { jsPDF } from "jspdf";

const PDF = new jsPDF();

const RD = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header /> {/* Assuming this is your header component */}
            {/* <Header /> */}
            <main className="flex justify-center items-center ">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    <div>
                        <iframe src="/รด.1.pdf" frameBorder="0" width="100%" height="600px"></iframe>
                    </div>
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/rordor/parents">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                หน้าก่อนหน้า
                            </button>
                        </a>

                        <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                            Download
                        </button>

                    </div>
                </div>
            </main>
        </div>
    );
}
const Header = () => {
    return (
        <header className="bg-pink-100 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/path/to/logo.png" alt="Logo" className="h-12 mr-4" />
                    <div>
                        <h1 className="text-xl font-bold text-pink-600">ฝ่ายทุนการศึกษาและบริการนิสิต</h1>
                        <p className="text-gray-700">Department of Scholarships & Students Service</p>
                        <p className="text-gray-700">Office of the Student Affairs, Chulalongkorn University</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default RD;
