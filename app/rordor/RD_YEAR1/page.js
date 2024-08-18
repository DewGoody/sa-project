'use client'; // This marks the component as a Client Component

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useFormData } from '@/app/contexts/FormDataContext';

const RD = () => {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("/api/Province");
      setProvinces(response.data);
    } catch (err) {
      console.log("Error fetching provinces: " + err);
    }
  };

  const fetchAmphuresById = async (id) => {
    try {
      const response = await axios.get(`/api/Amphure/${id}`);
      setAmphures(response.data);
    } catch (err) {
      console.log("Error fetching amphures: " + err);
    }
  };

  const fetchDistrictsById = async (id) => {
    try {
      const response = await axios.get(`/api/District/${id}`);
      setDistricts(response.data);
    } catch (err) {
      console.log("Error fetching districts: " + err);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });

    if (name === "province") {
      const id = e.target.selectedOptions[0]?.dataset.id;
      fetchAmphuresById(id);
    } else if (name === "amphure") {
      const id = e.target.selectedOptions[0]?.dataset.id;
      fetchDistrictsById(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    router.push('/rordor/RD_YEAR1/military');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-100">
        <main className="flex justify-center items-center">
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

                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">คำนำหน้า (Nametitle)</label>
                    <input
                      type="text"
                      name="Nametitle"
                      value={formData.Nametitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nametitle"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">นามสกุล (Surname)</label>
                  <input
                    type="text"
                    name="Surname"
                    value={formData.Surname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Surname"
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
                  <label className="block text-gray-700 mb-2">นามสกุลบิดา (Father's surname)</label>
                  <input
                    type="text"
                    name="fatherSurname"
                    value={formData.fatherSurname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Father's surname"
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
                  <label className="block text-gray-700 mb-2">นามสกุลมารดา (Mother's surname)</label>
                  <input
                    type="text"
                    name="motherSurname"
                    value={formData.motherSurname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Mother's surname"
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
                      {provinces.map((item, index) => (
                        <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                    <select
                      name="amphure"
                      value={formData.amphure}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">กรุณาเลือกเขต</option>
                      {amphures.map((amphure, index) => (
                        <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">กรุณาเลือกแขวง</option>
                      {districts.map((district, index) => (
                        <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                      ))}
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
                    {districts.map((district, index) => (
                      <option key={index} value={district.zipCode}>{district.zipCode}</option>
                    ))}
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