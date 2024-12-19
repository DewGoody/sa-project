'use client'
import React, { use } from "react";
import { Header } from "../components/Header";

import {
  FaUser,
  FaPlus,
  FaEye,
  FaCheck,
  FaRegHospital,
  FaGlobeAmericas,
} from "react-icons/fa";
import {useState,useEffect} from 'react';
import axios from 'axios';

export const Form = () => {

  const [prakanData, setPrakanData] = useState([]);
    const [studentInfo, setStudentInfo] = useState({});
  
    const [inputValue, setInputValue] = useState('');
    const [thaiText, setThaiText] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [period, setPeriod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prakanDone,setPrakanDone] = useState(false);
    const timeSlots = 
  [
    '8:00-8:30', '8:30-9:00','9:00-9:30', '9:30-10:00','10:00-10:30', '10:30-11:00','11:00-11:30', '11.30-12.00',
    '13:00-13:30', '13:30-14:00','14:00-14:30', '14:30-15:00','15:00-15:30', '15:30-16:00','16:00-16:30', '16.30-17.00',
  ];
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
   

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('/api/profile'); // Example API
            console.log(response.data);
            
            setProfileData(response.data);
            setLoading(false);
            console.log(response.data);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
        fetchData();
  
      }, []);

      const fetchQueue = async () => {
        try {          
          const response = await axios.post('/api/queue/getByStuId',{studentId: profileData.id}); // Example API
          console.log("wuw",response.data);
          setPrakanData(response.data.data);
          setPrakanDone(true);
          setPeriod(response.data.data[0].Timeslot.period);
          setLoading(false);

        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }        
      useEffect(() => {
          fetchQueue();

      }
      , [profileData]);
      console.log("prakanData", prakanData);
      console.log("prakanData length", prakanData.length);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };




  let count = 1;

  return (
    <div className="min-h-screen bg-white">
      <Header req1="" req2="" />
      <main className="flex justify-center items-center ">
        <div className="bg-white p-8  w-full mx-72">
          <div>
            <ServiceCard
              className="border-black "
              title={profileData ? profileData.fnameTH + " " + profileData.lnameTH + " " + profileData.id : ""}
              icon={<FaUser />}
            />
          </div>

          <div className=" py-8">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Status</p>
            </div>
            <div className=" justify-between items-center">
              {prakanDone && Array.isArray(prakanData) ? (
                prakanData.map((item, index) => (
                  index == 0 ? (
                    item.Timeslot.period.map((timee, timeIndex) => (
                      timee != 0 && (
                        <div key={timeIndex} className="flex justify-between items-center">
                          <ServiceCard
                            title={count++ + ". " + item.Request.type + "  " + formatDate(item.Timeslot.date) + " ( " + timeSlots[timeIndex] + " น. )" + " " + item.Request.status}
                          />
                        </div>
                      )
                    ))
                  ) : null
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>

          <p className="text-lg font-bold py-4">Service</p>
          <div className="space-y-8 ">
            <a href="/prakan">
              <ServiceCard
                title="1. การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)"
                icon={<FaCheck />}
              />
            </a>
            <a href="/rordor">
              <ServiceCard
                title="2. การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)"
                icon={<FaPlus />}
              />
            </a>
            <a href="/ponpan">
              <ServiceCard
                title="3. การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)"
                icon={<FaEye />}
              />
            </a>
            <a>
              <ServiceCard
                title="4. โครงการหลักประกันสุขภาพถ้วนหน้า (Universal Health Coverage Scheme)"
                icon={<FaRegHospital />}
              />
            </a>
            <a href="/prakan-inter">
              <ServiceCard
                title="5. Health Insurance For Foreigner Student"
                icon={<FaGlobeAmericas />}
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

const ServiceCard = ({ title, icon }) => {
  return (
    <div className="flex justify-start items-center mt-10 rounded-xl p-8 shadow-lg bg-white border border-gray-700">
      <div className="text-2xl">{icon}</div>
      <div className=" ">
        <div className=" ml-6 border-gray-300"></div>
      </div>
    {icon ? (
      <div className="ml-5 text-gray-700">{title}</div>
    ) : (
      <div className="px-16">
        <p className=" -ml-28 text-gray-700 font-semibold">{title}</p>
      </div>
    )}
    </div>
  );
};

export default Form;