// pages/rordor/parents.js
'use client';
import React from 'react';
import { useFormData } from '../../contexts/FormDataContext'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';


const ParentsForm = () => {
  const { formData, updateFormData } = useFormData();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    router.push('/rordor/checkData');
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
            การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. ชั้นปีที่ ๑ (I)
          </h2>
          <h1 className="text-xl text-gray-700 mb-6 text-center">
            New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.
          </h1>
          <section>
            <h3 className="text-lg font-semibold mb-4 text-center">คำยินยอมจากผู้ปกครอง (Parental consent)</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">คำนำหน้า (Nametitle)</label>
                    <input
                      type="text"
                      name="Parenttitle"
                      value={formData.Parenttitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nametitle"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                    <input
                      type="text"
                      name="ParentName"
                      value={formData.ParentName}
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
                    name="ParentSurname"
                    value={formData.ParentSurname}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Name-Surname"
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-700 mb-2">อายุ (Age)</label>
                    <select
                      name="Parentage"
                      value={formData.Parentage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="" disabled>Select your age</option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">อาชีพ (Job)</label>
                    <input
                      type="text"
                      name="Parentjob"
                      value={formData.Parentjob}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Job"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work address)</label>
                  <input
                    type="text"
                    name="ParentworkAddress"
                    value={formData.ParentworkAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Work address"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">เกี่ยวข้องเป็น (Related)</label>
                  <input
                    type="text"
                    name="Parentrelated"
                    value={formData.Parentrelated}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Related"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <a href="/rordor/RD_YEAR1/military">
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

export default ParentsForm;