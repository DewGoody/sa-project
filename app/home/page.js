import React from 'react';
import { Header } from '../components/Header';
import { FaUser, FaPlus, FaEye, FaCheck, FaRegHospital } from 'react-icons/fa';

const Form = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex justify-center items-center ">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <div className="">
            <ServiceCard title="ดูแลและแก้ไขข้อมูลส่วนตัวของคุณ" icon={<FaUser />} />
          </div>
          <div className=" py-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Status</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg font-bold">Service</p>
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
    <div className="flex justify-between items-center rounded-full p-4 shadow-center-lg bg-white">
      <p className="text-gray-700">{title}</p>
      <div className="flex items-center">
        <div className="border-r border-gray-300 pr-4 mr-4"></div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}


export default Form;