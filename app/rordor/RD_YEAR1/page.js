'use client'; // This marks the component as a Client Component

import React, { useState } from 'react';
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation';


const RD = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fatherName: '',
    citizenId: '',
    birthDate: '',
    religion: '',
    ethnicity: '',
    nationality: '',
    motherName: '',
    occupation: '',
    domicileNumber: '',
    road: '',
    province: '',
    district: '',
    subdistrict: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    router.push('/rordor/RD_YEAR1/military')
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="flex justify-center items-center ">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
              การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. ชั้นปีที่ ๑ (I)
            </h2>
            <h1 className="text-xl text-gray-700 mb-6 text-center">
              New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.
            </h1>

            {/* Personal & Contact Information Section */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                ข้อมูลส่วนตัวและภูมิลำเนา (Personal & Contact Information)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">ชื่อและนามสกุล (Name-Surname)</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Name-Surname"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">เลขประจำตัวประชาชน (Citizen identity number)</label>
                  <input
                    type="text"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Citizen identity number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">วัน, เดือน, ปีเกิด (Date of birth)</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Date of birth"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ศาสนา (Religion)</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Religion"
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">เชื้อชาติ (Ethnicity)</label>
                    <input
                      type="text"
                      name="ethnicity"
                      value={formData.ethnicity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ethnicity"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nationality"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's name)</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Father's name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ชื่อมารดา (Mother's name)</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Mother's name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">อาชีพบิดา/มารดา (Father/Mother's Occupation)</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Father/Mother's Occupation"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ภูมิลำเนาปัจจุบันเลขที่ (Current domicile number)</label>
                  <input
                    type="text"
                    name="domicileNumber"
                    value={formData.domicileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Current domicile number"
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                    <input
                      type="text"
                      name="road"
                      value={formData.road}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Road"
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
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                  <select
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">กรุณาเลือกรหัสไปรษณีย์</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <a href="/rordor">
                <button type='button' className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                  หน้าก่อนหน้า
                </button>
              </a>
                <button type='submit' className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                  หน้าถัดไป
                </button>
            </div>
          </div>
        </main>
      </div>
    </form>
  );
}

export default RD;