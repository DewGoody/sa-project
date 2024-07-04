import React from 'react';

const RD = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header /> {/* Assuming this is your header component */}
            <main className="flex justify-center items-center py-10">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
                        การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. 
                    </h2>
                    <h1 className="text-xl text-gray-700 mb-6 text-center">
                        New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.
                    </h1>

                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            เลือกชั้นปี (Choose Year)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex justify-center">
                                <a href="/rordor/RD_YEAR1">
                                    <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                                       เข้ารับการฝึกวิชาทหาร ปี 1 (Enter military training in Year 1.)
                                    </button>
                                </a>
                            </div>
                            <div className="flex justify-center">
                                <a href="/rordor/RD_YEAR2">
                                    <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                                        เข้ารับการฝึกวิชาทหาร ปี 2 เป็นต้นไป (Enter military training starting from year 2 onwards.)
                                    </button>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/home">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                หน้าก่อนหน้า
                            </button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RD;