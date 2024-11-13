"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FaUser, FaPlus, FaEye, FaCheck, FaGlobeAmericas, FaRegHospital } from 'react-icons/fa';
import axios from 'axios';

export const Form = () => {
  const [datafromapiprofile, setdatafromapiprofile] = useState({});
  const fetchdataapi = async () => {
    try {
      const response = await axios.get("/api/profile");
      setdatafromapiprofile(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchdataapi();

  }, [])
  useEffect(() => {

  }, [datafromapiprofile])

  return (
    <div className="min-h-screen bg-white">

      <Header req1="" req2="" />
      <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">
        <main className="flex justify-center items-center ">
          <div className="bg-white p-8 min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24">
            <div className="">
              <ServiceCard title={datafromapiprofile.title + " " + datafromapiprofile.fnameTH + " " + datafromapiprofile.lnameTH} icon={<FaUser />} />
            </div>

            <div className=" py-8">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Status</p>
              </div>
            </div>

            <p className="text-lg font-bold py-4">Service</p>
            <div className="space-y-8 ">
              <a href="/rordor" ><ServiceCard title="การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)" icon={<FaPlus />} /></a>

              <a href="/prakan" className="p-4"><ServiceCard title="การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)" icon={<FaCheck />} /></a>
              <a href="/golden_card"><ServiceCard title="ย้ายสิทธิ์บัตรทองมาที่โรงพยาบาลจุฬาลงกรณ์" icon={<FaRegHospital />} /></a>
              <ServiceCard title="การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)" icon={<FaEye />} />
              <a  className="p-4" href="/prakan-inter">
                <ServiceCard
                  title="Health Insurance For Foreigner Student"
                  icon={<FaGlobeAmericas />}
                />
              </a>
            </div>
          </div>
        </main>
      </div>
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