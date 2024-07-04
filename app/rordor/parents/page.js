import React from 'react';

const RD = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header /> {/* Assuming this is your header component */}
            <main className="flex justify-center items-center py-10">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
                        การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. ชั้นปีที่ ๑ (I) 
                    </h2>
                    <h1 className="text-xl text-gray-700 mb-6 text-center">
                        New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.
                    </h1>
                    {/* Parental Consent Section d*/}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">คำยินยอมจากผู้ปกครอง (Parental consent)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">ข้าพเจ้า (Name-Surname)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Name-Surname" />
                            </div>
                            <div className="flex space-x-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">อายุ (Age)</label>
                                    <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                                        <option value="" disabled selected>Select your age</option>
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">อาชีพ (Job)</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Job" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work address)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Work address" />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">เกี่ยวข้องเป็น (Related)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Related" />
                            </div>
                        </div>
                    </section>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/rordor/RD_YEAR1">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                หน้าก่อนหน้า
                            </button>
                        </a>
                        <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                            หน้าถัดไป
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RD;