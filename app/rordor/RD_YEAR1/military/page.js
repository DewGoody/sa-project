'use client'; // Ensure this is at the top

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing in app directory
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });

    if (name === "militaryProvince") {
      const id = e.target.selectedOptions[0]?.dataset.id;
      await fetchAmphuresById(id);
    } else if (name === "militaryDistrict") {
      const id = e.target.selectedOptions[0]?.dataset.id;
      await fetchDistrictsById(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    router.push('/rordor/parents');
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
                    name="militaryProvince"
                    value={formData.militaryProvince}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">กรุณาเลือกจังหวัด</option>
                    {provinces.map((item, index) => (
                      <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                    <select
                      name="militaryDistrict"
                      value={formData.militaryDistrict}
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
                      name="militaryAmphure"
                      value={formData.militaryAmphure}
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
                    {provinces.map((item, index) => (
                      <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                    ))}
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