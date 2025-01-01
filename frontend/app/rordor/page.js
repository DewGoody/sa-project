import React from 'react';
import { Header } from '../components/Header';

const RD = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header req1="การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร" req2="Request for deferral of military service" />
            <main className="flex justify-center items-center ">
                <div className="bg-white p-8  w-full max-w-4xl">

                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            เลือกชั้นปี (Choose Year)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex justify-center">
                                <a href="/rordor/checkData">
                                    <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                                        การสมัครเป็น นศท. ปี 1 (ผู้ไม่เคยศึกษาวิชาทหาร) (Application for first-year territorial defense student (never studied military science))
                                    </button>
                                </a>
                            </div>
                            <div className="flex justify-center">
                                <a href="/rordor/checkData2">
                                    <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                                        การรายงานตัว นศท. ปี 2 เป็นต้นไป (Enrollment for territorial defense students year 2 and beyond)
                                    </button>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/home">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                Back
                            </button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RD;