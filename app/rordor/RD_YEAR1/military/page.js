'use client'; // Ensure this is at the top

import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing in app directory

const RD = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    militaryDomicileNumber: '',
    province: '',
    district: '',
    subdistrict: '',
    grade9GPAX: '',
    school: '',
    schoolProvince: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to API
    console.log(formData);
    router.push('/rordor/parents');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex justify-center items-center">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
            การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. ชั้นปีที่ ๑ (I)
          </h2>
          <h1 className="text-xl text-gray-700 mb-6 text-center">
            New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.
          </h1>

          {/* Military domicile Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              ภูมิลำเนาทหาร (Military domicile)
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">ภูมิลำเนาทหารเลขที่ (Military domicile number)</label>
                  <input
                    type="text"
                    name="militaryDomicileNumber"
                    value={formData.militaryDomicileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Military domicile number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">กรุณาเลือกจังหวัด</option>
                    <option value="Bangkok">กรุงเทพมหานคร</option>
                    <option value="Chiang Mai">เชียงใหม่</option>
                    <option value="Phuket">ภูเก็ต</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">กรุณาเลือกเขต</option>
                      {/* Add district options here */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                    <select
                      name="subdistrict"
                      value={formData.subdistrict}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">กรุณาเลือกแขวง</option>
                      {/* Add subdistrict options here */}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">สำเร็จชั้น ม.๓ คะแนนเฉลี่ย (Grade 9 GPAX)</label>
                  <input
                    type="text"
                    name="grade9GPAX"
                    value={formData.grade9GPAX}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Grade 9 GPAX"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จากโรงเรียน (School)</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="School"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จังหวัด (School's province)</label>
                  <select
                    name="schoolProvince"
                    value={formData.schoolProvince}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">กรุณาเลือกจังหวัด</option>
                    <option value="Bangkok">กรุงเทพมหานคร</option>
                    <option value="Chiang Mai">เชียงใหม่</option>
                    <option value="Phuket">ภูเก็ต</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <a href="/rordor/RD_YEAR1">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                  >
                    หน้าก่อนหน้า
                  </button>
                </a>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                >
                  หน้าถัดไป
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default RD;