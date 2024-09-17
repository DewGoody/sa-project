import React from 'react';
import { Header } from '../components/Header';
import { FaUser, FaPlus, FaEye, FaCheck, FaRegHospital } from 'react-icons/fa';

const Form = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header req1="" req2="" />
      <main className="flex justify-center items-center ">
        <div className="bg-white p-8  w-full mx-72">
          <div className="">
            <ServiceCard title="ตรวจสอบข้อมูลส่วนตัวของคุณ (Verify your personal information)" icon={<FaUser />} />
          </div>

          <div className=" py-8">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Status</p>
            </div>
          </div>

          <p className="text-lg font-bold py-4">Service</p>
          <div className="space-y-8 py-4">


            <a  href="/rordor"><ServiceCard title="การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)" icon={<FaPlus />} /></a>
            <a  href="/prakan"><ServiceCard title="การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)" icon={<FaEye />} /></a>
            <ServiceCard title="การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)" icon={<FaCheck />} />
            <ServiceCard title="โครงการหลักประกันสุขภาพถ้วนหน้า (Universal Health Coverage Scheme)" icon={<FaRegHospital />} />
          </div>
        </div>
      </main>
    </div>
  );
}

const ServiceCard = ({ title, icon }) => {
  return (
    <div className="flex justify-between items-center rounded-2xl p-8 shadow-center-lg bg-white">
      <p className="text-gray-700">{title}</p>
      <div className="flex items-center">
        <div className="border-r border-gray-300  pr-4 mr-4"></div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}


export default Form;