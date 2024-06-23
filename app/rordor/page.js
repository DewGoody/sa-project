import React from 'react';

const RD = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header /> {/* Assuming this is your header component */}
      <main className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <h2 className="text-lg font-bold ">การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รอ. ชั้นปีที่ ๑ (I)</h2>
          <h1 className="text-lg text-gray-700 mb-4">New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.</h1>

          {/* Personal & Contact Information Section */}
          <section>
            <h3 className="text-md font-semibold mb-2">ข้อมูลส่วนตัวและภูมิบำเนา (Personal & Contact Information)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">ชื่อและนามสกุล (Name-Surname)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Name-Surname" />
              </div>
              <div>
                <label className="block text-gray-700">เลขประจำตัวประชาชน (Citizen identity number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Citizen identity number" />
              </div>
              <div>
                <label className="block text-gray-700">วัน, เดือน, ปีเกิด (Date of birth)</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Date of birth"
                />
              </div>
              <div>
                <label className="block text-gray-700">ศาสนา (Religion)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Religion" />
              </div>
              <div>
                <label className="block text-gray-700">เชื้อชาติ (Nationality)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nationality" />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อบิดา (Father's name)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Father's name" />
              </div>
              <div>
                <label className="block text-gray-700">ชื่อมารดา (Mother's name)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Mother's name" />
              </div>
              <div>
                <label className="block text-gray-700">อาชีพบิดา/มารดา (Father/Mother's Occupation)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Father/Mother's Occupation" />
              </div>
              <div>
                <label className="block text-gray-700">ภูมิลำเนาปัจจุบันเลขที่ (Current domicile number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Current domicile number" />
              </div>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-gray-700">ถนน (Road)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Road" />
                </div>
                <div>
                  <label className="block text-gray-700">จังหวัด (province)</label>
                  <select
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  <label className="block text-gray-700">เขต/อำเภอ (District)</label>
                  <select
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกเขต</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">แขวง/ตำบล (Subdistrict)</label>
                  <select
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกแขวง</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">รหัสไปรษณีย์ (Zip code)</label>
                <select
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  defaultValue=""
                >
                  <option value="">กรุณาเลือกรหัสไปรษณีย์</option>
                </select>
              </div>
            </div>
          </section>

          {/* Military domicile Section */}
          <section>
            <br></br>
            <h3 className="text-md font-semibold mb-2">ภูมิลำเนาทหาร (Military domicile)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">ภูมิลำเนาทหารเลขที่ (Military domicile number)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Military domicile number" />
              </div>
              <div>
                <label className="block text-gray-700">จังหวัด (province)</label>
                <select
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  <label className="block text-gray-700">เขต/อำเภอ (District)</label>
                  <select
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกเขต</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">แขวง/ตำบล (Subdistrict)</label>
                  <select
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue=""
                  >
                    <option value="">กรุณาเลือกแขวง</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">สำเร็จชั้น ม.๓ คะแนนเฉลี่ย (Grade 9 GPAX)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Grade 9 GPAX" />
              </div>
              <div>
                <label className="block text-gray-700">จากโรงเรียน (School)</label>
                <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="School" />
              </div>
              <div>
                <label className="block text-gray-700">จังหวัด (School's province)</label>
                <select
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
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
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded">หน้าก่อนหน้า</button>
            <button className="px-4 py-2 bg-pink-300 rounded">หน้าถัดไป</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RD;

