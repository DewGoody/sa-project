import React from 'react';
import { FaUser, FaPlus, FaEye, FaCheck, FaRegHospital } from 'react-icons/fa';

const Form = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-500">บัญชีผู้ใช้</p>
              <p className="text-lg font-semibold">ดูแลและแก้ไขข้อมูลส่วนตัวของคุณ</p>
            </div>
            <FaUser className="text-2xl" />
          </div>
          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Status</p>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <a href="/rordor"><ServiceCard title="การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร รด. รายใหม่ (ENG)" icon={<FaPlus />} /></a>
            <ServiceCard title="การขอผ่อนผันการเข้ารับราชการทหาร" icon={<FaEye />} />
            <ServiceCard title="การเบิกจ่ายประกันอุบัติเหตุ" icon={<FaCheck />} />
            <ServiceCard title="โครงการหลักประกันสุขภาพถ้วนหน้า" icon={<FaRegHospital />} />
          </div>
        </div>
      </main>
    </div>
  );
}

const ServiceCard = ({ title, icon }) => {
  return (
    <div className="flex justify-between items-center border rounded p-4">
      <p className="text-gray-700">{title}</p>
      <div className="text-2xl">{icon}</div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="bg-pink-100 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/path/to/logo.png" alt="Logo" className="h-12 mr-4" />
          <div>
            <h1 className="text-xl font-bold text-pink-600">ฝ่ายทุนการศึกษาและบริการนิสิต</h1>
            <p className="text-gray-700">Department of Scholarships & Students Service</p>
            <p className="text-gray-700">Office of the Student Affairs, Chulalongkorn University</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Form;