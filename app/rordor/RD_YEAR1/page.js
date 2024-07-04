import React from 'react';

const RD = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header /> {/* Assuming this is your header component */}
      <main className="flex justify-center items-center py-10">
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
              ข้อมูลส่วนตัวและภูมิบำเนา (Personal & Contact Information)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">ชื่อและนามสกุล (Name-Surname)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Name-Surname" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">เลขประจำตัวประชาชน (Citizen identity number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Citizen identity number" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">วัน, เดือน, ปีเกิด (Date of birth)</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Date of birth"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">ศาสนา (Religion)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Religion" />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-gray-700 mb-2">เชื้อชาติ (Ethnicity)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Ethnicity" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nationality" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's name)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Father's name" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">ชื่อมารดา (Mother's name)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Mother's name" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">อาชีพบิดา/มารดา (Father/Mother's Occupation)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Father/Mother's Occupation" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">ภูมิลำเนาปัจจุบันเลขที่ (Current domicile number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Current domicile number" />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Road" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกเขต</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกแขวง</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  defaultValue=""
                >
                  <option value="">กรุณาเลือกรหัสไปรษณีย์</option>
                </select>
              </div>
            </div>
          </section>

          {/* Military domicile Section */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              ภูมิลำเนาทหาร (Military domicile)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">ภูมิลำเนาทหารเลขที่ (Military domicile number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Military domicile number" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  defaultValue=""
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกเขต</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                    >
                      <option value="">กรุณาเลือกแขวง</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">สำเร็จชั้น ม.๓ คะแนนเฉลี่ย (Grade 9 GPAX)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Grade 9 GPAX" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จากโรงเรียน (School)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="School" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">จังหวัด (School's province)</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกจังหวัด</option>
                    <option value="Bangkok">กรุงเทพมหานคร</option>
                    <option value="Chiang Mai">เชียงใหม่</option>
                    <option value="Phuket">ภูเก็ต</option>
                  </select>
                </div>
              </div>
            </section>
  
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <a href="/rordor">
                <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                  หน้าก่อนหน้า
                </button>
              </a>
              <a href="/rordor/parents">
                <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300">
                  หน้าถัดไป
                </button>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default RD;