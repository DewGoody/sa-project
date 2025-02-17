"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../../../../components/Header.js';
import numberToThaiText from "../../../../components/numberToThaiText.js";
import { useRouter,useParams } from 'next/navigation';
import { Select, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

export default function Form() {
  const {token} = useParams();
  const [prakanData, setPrakanData] = useState({});
  const [studentInfo, setStudentInfo] = useState({});

  const [inputValue, setInputValue] = useState('');
  const [thaiText, setThaiText] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyData, setAlreadyData] = useState('');
  const [date, setDate] = useState("");

  const router = useRouter();
  const {form} = useParams();

  console.log("form", form);
  console.log("type Form : ", typeof form);


  const fetchDataForm = async () => {
    try {
      const response = await axios.post(`/api/prakan/getDataById`, { id: parseInt(form) });
      console.log("fetchData",response.data.data);
      const isoDate = response.data.data.acc_date;
      const formattedDate = isoDate.split("T")[0];
      setDate(formattedDate); 
      const thaiText = numberToThaiText(response.data.data.medical_fee);
      response.data.data.thaiText = thaiText
      response.data.data.formId = form
      response.data.data.acc_date = formattedDate
      setAlreadyData(response.data.data);
      setPrakanData(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    const response = await axios.get('/api/profile'); // Example API
        console.log(response.data);
        
        setProfileData(response.data);
        setLoading(false);
        console.log(response.data);
  };


  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (form !== "0") {
      setTimeout(() => {
        fetchDataForm();
      }, 1000);
    }
  }, []);

  const handleChangeThai = (e) => {
    const value = e.target.value;
        // Allow only numbers and decimal point
        if (!/^(\d+(\.\d{0,2})?)?$/.test(value)) {
            return;
        }
        setInputValue(value);
        if (value !== '') {
            const number = parseFloat(value);
            const thaiText = numberToThaiText(number);
            setThaiText(thaiText);
            setPrakanData({ ...prakanData, medical_fee_text: thaiText , medical_fee: value});
            setAlreadyData({ ...alreadyData, medical_fee_text: thaiText , medical_fee: value});
            console.log(thaiText);
        } else {
            setThaiText('');
            console.log(thaiText);
        }
  };

  const handleChangeName = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...data, name: event.target.value });
  };

  const handleChangeId = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...data, stu_id: event.target.value });
  };

  const handleChangePhone = (event) => {
    console.log(event.target.value);
    setProfileData({ ...profileData, tel_num: event.target.value });
  };
  const handleChangeFaculty = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, faculty: event.target.value });
  };
  const handleChangeDesAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, acc_desc: event.target.value });
    setAlreadyData({ ...alreadyData, acc_desc: event.target.value });
  };
  const handleChangeEmail = (event) => {
    console.log(event.target.value);
    setProfileData({ ...profileData, personal_email: event.target.value });
  };
  const handleChangeDesInj = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, des_injury: event.target.value });
    setAlreadyData({ ...alreadyData, des_injury: event.target.value });
  };
  const handleChangeDateAcc = (event) => {
   console.log("dateeeee", prakanData.acc_date);
   setDate(event)
    const timestamp = new Date(event)
    console.log("timestamp",timestamp);
    setPrakanData({ ...prakanData, acc_date: timestamp });
    setAlreadyData({ ...alreadyData, acc_date: timestamp });

  };
  const handleChangePlaceAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, accident_place: event.target.value });
    setAlreadyData({ ...alreadyData, accident_place: event.target.value });
  };
  const handleChangePlaceTreat = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, treatment_place: event.target.value });
    setAlreadyData({ ...alreadyData, treatment_place: event.target.value });
  };
  const handleChangeTypeHos = (event) => {
    console.log("event",event);
    setPrakanData({ ...prakanData, hospital_type: event });
    setAlreadyData({ ...alreadyData, hospital_type: event });
  };
  const handleChangeMedicalFeeNum = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medical_fee: (event.target.value)});
  };

  console.log("prakanDataJaa",prakanData);

  const handleSubmit = async (event) => {
    try {
      if(form !== '0'){
        let allData = { ...alreadyData, ...studentInfo, ...thaiText, ...profileData };
        const response = await axios.post('/api/prakan/update', allData);
        console.log("responseId :",response.data.data.id);
        router.push(`/student/${token}/prakan/checkPrakan/${form}`);
      }else{
        let allData = { ...prakanData, ...studentInfo, ...thaiText, ...profileData };
        console.log("prakanData === 0 :",allData);
        console.log("prakanAllData === 0 :",allData);
        const response = await axios.post('/api/prakan/create', allData);
        const formId = response.data.data.id
        router.push(`/student/${token}/prakan/checkPrakan/${formId}`);
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className=" bg-white min-h-screen">
      <Header req1="การเบิกจ่ายประกันอุบัติเหตุ" req2="Accident insurance claim"/>
      <div className=" mx-24 ">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              ข้อมูลส่วนตัว (Personal & contact information)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >ชื่อและนามสกุล (Fullname-Surname) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      defaultValue={profileData.fnameTH + " " + profileData.lnameTH}
                      className="ml-2 w-72 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={
                        profileData.fnameTH + " " + profileData.lnameTH
                      }
                    />
                  </div>
                </div>
                <div className="flex">
                <label className="block text-gray-700 mt-1">รหัสนิสิต (Student ID) :</label>
                  <div>
                    <input
                      type="text"
                      name="id"
                      defaultValue={profileData.id}
                      className="ml-2  px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      
                    />
                  </div>
                </div>

                <div className="flex">
                  <label className="block text-gray-700 mt-1">คณะ (Faculty) :</label>
                  <div className="">
                    <input
                      type="text"
                      name="faculty"
                     defaultValue={profileData.facultyNameTH}
                      className="ml-2 w-96 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={studentInfo.facultyNameTH}
                    />
                  </div>
                </div>
                <div>
                  
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >หมายเลขโทรศัพท์ (Phone number) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePhone}
                     className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData.tel_num}
                    />
                  </div>
                </div>
                <div>
                <label className="block text-gray-700 mt-1" >
                    อีเมล (Email) :
                    <input
                      type="email"
                      name="email"
                      onChange={handleChangeEmail}
                      className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData.personal_email}
                    />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </main>

        <main className="flex justify-center bg-white w-full">
          <div className="bg-white   w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              {" "}
              ข้อมุลการเกิดอุบัติเหตุและการรักษาพาบาล (Accident & treatment details)
            </h3>
            <div>
              <form className="grid grid-cols-2  gap-y-12 gap-x-7 m-6 bg-white">
                <div>
                  <label className="flex">
                    <div className="block text-gray-700 mt-1" >
                    อาการบาดเจ็บ (Description of injury) :
                    </div>
                    <textarea 
                      className="ml-2 px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" cols="32" rows="2" 
                      onChange={handleChangeDesInj}
                      value={alreadyData.des_injury}
                    >

                    </textarea>
                  </label>
                  <div className="text text-sm text-red-600 mt-2">
                  * โปรดระบุตามใบรับรองแพทย์ (Please specify according to the doctor's certificate)
                  </div>
                </div>
                <div>
                <label className="flex">
                    
                    <div className="block text-gray-700 mt-1" >
                    การเกิดอุบัติเหตุ (Description of accident) :
                    </div>
                    <textarea 
                      className="ml-2 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" cols="23" rows="2" 
                      onChange={handleChangeDesAcc}
                      value={alreadyData.acc_desc}
                      >

                      </textarea>
                   
                  </label>
                  <div className="text text-sm text-red-600 mt-2">
                  * โปรดระบุตามใบรับรองแพทย์ (Please specify according to the doctor's certificate)
                  </div>
                </div>
                <div>
                <label className="block text-gray-700 mt-1" >
                    ชื่อสถานพยาบาลที่เข้ารับการรักษา (Place of treatment) :
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePlaceTreat}
                      value={alreadyData.treatment_place}
                      className="ml-2  px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </label>
                </div>
                
                <div className="flex">
                <label className="block text-gray-700 mt-1" >
                    ประเภทสถานพยาบาล (Type of hospital) :
                  </label>
                  <div className="ml-2">
                    <Select
                      onChange={handleChangeTypeHos}
                      style={{ width: 220 }}
                      defaultValue="เลือกประเภทสถานพยาบาล"
                      value={alreadyData.hospital_type}
                      
                      
                    >
                      <option value="เลือกประเภทสถานพยาบาล" disabled>
                        เลือกประเภท (select type)
                       </option>
                      <option value="โรงพยาบาลรัฐ" className="text-gray-800">โรงพยาบาลรัฐ (public hospital)</option>
                      <option value="โรงพยาบาลเอกชน">โรงพยาบาลเอกชน (private hospital)</option>
                      <option value="คลินิก">คลินิก (clinic)</option>
                    </Select>
                  </div>
                </div>
                <div className="flex">
                <label className="block text-gray-700 mt-1" >
                    วันที่เกิดอุบัติเหตุ (Date of accident) :
                    <Space direction="vertical" className="ml-3">
                      <DatePicker 
                        onChange={handleChangeDateAcc}  
                        format="DD/MM/YYYY"  
                        placeholder="เลือกวัน (select date)"
                        style={{ width: 220 }}
                        value={dayjs(alreadyData?.acc_date)}
                      />
                    </Space>  
                  </label>
                </div>
                <div>
                  <label className="block text-gray-700 mt-1" >
                    สถานที่เกิดอุบัติเหตุ (Place of accident) :
                    <input
                      type="text"
                      name="id"
                      onChange={handleChangePlaceAcc}
                      value={alreadyData.accident_place}
                      className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </main>

        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              ค่ารักษาพยาบาลรวมสุทธิ (Net of medical fee total amount)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="">
                  <label className="block text-gray-700 mt-1" >
                    ตัวเลข (in numbers) :
                    <input
                      type="num"
                      onChange={handleChangeThai}
                      value={alreadyData.medical_fee}
                      className="ml-2  px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </main>
        <div className="flex justify-end">
        
          <button
            onClick={handleSubmit}
            className="bg-pink-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
          >
            Check data
          </button>
    
        </div>
      </div>
    </div>
  );
}
