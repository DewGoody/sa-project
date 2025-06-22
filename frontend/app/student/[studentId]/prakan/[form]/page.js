"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../../../../components/Header.js';
import { useRouter,useParams } from 'next/navigation';
import { Select, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

export default function Form() {
  const {studentId} = useParams();
  const [prakanData, setPrakanData] = useState({});
  const [studentInfo, setStudentInfo] = useState({});
  const [degree, setDegree] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyData, setAlreadyData] = useState('');
  const [date, setDate] = useState("");
  const [yearLevel, setYearLevel] = useState('');
  const [isEditTime, setIsEditTime] = useState(false);
  const [isTypeHos2, setIsTypeHos2] = useState(false);
  const [isPlace2, setIsPlace2] = useState(false);
  const [errorSelect, setErrorSelect] = useState(false);



  const router = useRouter();
  const {form} = useParams();

  console.log("form", form);
  console.log("type Form : ", typeof form);


  const fetchDataForm = async () => {
    try {
      const response = await axios.post(`/api/prakan/getDataById`, { id: parseInt(form) });
      console.log("fetchData",response.data.data);
      console.log("typeHospital_type2", response.data.data.hospital_type2)
      if(response.data.data.treatment_place2 === ''){
        setIsTypeHos2(false);
      }
      else{
        setIsTypeHos2(true);
      }
      const isoDate = response.data.data.acc_date;
      const formattedDate = isoDate.split("T")[0];
      setDate(formattedDate); 
      response.data.data.formId = form
      response.data.data.acc_date = formattedDate
      setAlreadyData(response.data.data);
      setPrakanData(response.data.data);
      if(studentId === '0'){
        setProfileData(response.data.data.Student);
      }
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
        if(studentId !== '0'){
          fetchStudentData();
          if(form !== '0'){
            fetchDataForm();
            console.log("formKKK : ", form);
          }
        }else{
          fetchDataForm();
        }
  
      }, []);

      console.log("alreadyData",alreadyData);
      console.log("prakanData",prakanData);
      console.log("profileData",profileData);
      console.log("studentInfo",studentInfo);

  const handleChangeYearLevel = (e) => {
    setYearLevel(e.target.value);
    setProfileData({ ...profileData, yearLevel: e.target.value });
    setAlreadyData({ ...alreadyData, year: e.target.value });
    console.log("yearLevel : ", yearLevel);
  };

  const handleChangePhone = (event) => {
    console.log(event.target.value);
    setProfileData({ ...profileData, phone_num: event.target.value });
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
   console.log("dateEvent", event.target.value);
    const timestamp = new Date(event)
    console.log("timestamp",timestamp);
    setPrakanData({ ...prakanData, acc_date: event.target.value });
    setAlreadyData({ ...alreadyData, acc_date: event.target.value });

  };
  const handleChangePlaceAcc = (event) => {
    console.log("valueChangePlaceAcc",typeof event.target.value);
    if(event.target.value === "true"){
      setPrakanData({ ...prakanData, in_university: true });
      setAlreadyData({ ...alreadyData, in_university: true });
    }else if(event.target.value === "false"){
      setPrakanData({ ...prakanData, in_university: false });
      setAlreadyData({ ...alreadyData, in_university: false });
    }
  };
  const handleChangePlaceTreat = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, treatment_place: event.target.value });
    setAlreadyData({ ...alreadyData, treatment_place: event.target.value });
  };
  const handleChangePlaceTreat2 = (event) => {
  const value = event.target.value;
  console.log(value);

  const isEmpty = value === "" || value === null;
  setIsTypeHos2(!isEmpty);

  // ถ้า input ว่าง → ตั้งค่า hospital_type2 = 3
  if (isEmpty) {
    setAlreadyData({ ...alreadyData, treatment_place2: "", hospital_type2: 3 });
    setPrakanData({ ...prakanData, treatment_place2: "", hospital_type2: 3 });
  } else {
    setAlreadyData({ ...alreadyData, treatment_place2: value });
    setPrakanData({ ...prakanData, treatment_place2: value });
  }
  // เช็ค error ทุกครั้งเมื่อ input เปลี่ยน
  if (isEmpty && alreadyData.hospital_type2 === 3) {
    setErrorSelect(true);
  } else {
    setErrorSelect(false);
  }
};

  const handleChangeTypeHos1 = (event) => {
    console.log("event",event.target.value);
    setPrakanData({ ...prakanData, hospital_type: event.target.value });
    setAlreadyData({ ...alreadyData, hospital_type: event.target.value });
  };
  const handleChangeTypeHos2 = (event) => {
    const value = parseInt(event.target.value); // แปลงเป็น number
    console.log("event", value);
  
    // ถ้าเลือก 3 → เคลียร์ input
    if (value === '') {
      setAlreadyData({ ...alreadyData, hospital_type2: '', treatment_place2: "" });
      setPrakanData({ ...prakanData, hospital_type2: '', treatment_place2: "" });
      setIsTypeHos2(false);
      setErrorSelect(true); // ตั้งค่า errorSelect เป็น true
    } else {
      setAlreadyData({ ...alreadyData, hospital_type2: value });
      setPrakanData({ ...prakanData, hospital_type2: value });
      setIsTypeHos2(true);
      setErrorSelect(false); // ตั้งค่า errorSelect เป็น false
    }
  };
  
  const handleChangeMedicalFeeNum = (event) => {
    console.log("medicalFee",event.target.value);
    setPrakanData({ ...prakanData, medical_fee: (event.target.value)});
    setAlreadyData({ ...alreadyData, medical_fee: (event.target.value)});
  };
  const handleChangeTimeAcc = (event) => {
    console.log("time",event.target.value);
    console.log("typeTime",typeof event.target.value);
    setIsEditTime(true);
    setPrakanData({ ...prakanData, time_acc: event.target.value });
    setAlreadyData({ ...alreadyData, time_acc: event.target.value });
  };
  const handleChangeDegree = (e) => {
    setDegree(e.target.value);
    setProfileData({ ...profileData, degree: e.target.value });
    setAlreadyData({ ...alreadyData, degree: e.target.value });
    console.log("degree : ", degree);
  };

  const handleChangePlaceAccInfo = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, accident_place: event.target.value });
    setAlreadyData({ ...alreadyData, accident_place: event.target.value });
  };
  // console.log("timeLogKub", alreadyData?.time_acc?.split("T")[1]?.substring(0, 5))

  const handleSubmit = async (e) => {
    e.preventDefault();
      if(studentId !== '0'){
        if(form !== '0'){
          if(isEditTime === false){
            let allData = { ...alreadyData, ...studentInfo, ...profileData, time_acc:alreadyData?.time_acc?.split("T")[1]?.substring(0, 5) };
            console.log("submit :",allData);
            const response = await axios.post('/api/prakan/update', allData);
            console.log("responseSubmit",response.data.data)
            console.log("responseId :",response.data.data.id);
            const req_id = response.data.data.req_id
            router.push(`/student/${studentId}/prakan/checkPrakan/${req_id}/${form}`);
          }
          else{
            let allData = { ...alreadyData, ...studentInfo, ...profileData};
            console.log("submit :",allData);
            const response = await axios.post('/api/prakan/update', allData);
            console.log("responseSubmit",response.data.data)
            console.log("responseId :",response.data.data.id);
            const req_id = response.data.data.req_id
            router.push(`/student/${studentId}/prakan/checkPrakan/${req_id}/${form}`);
          }
          
        }else{
          let allData = { ...prakanData, ...studentInfo, ...profileData };
          console.log("submit :",allData);
          const response = await axios.post('/api/prakan/create', allData);
          console.log("responsePrakan :",response.data.data);
          const formId = response.data.data.id
          const req_id = response.data.data.req_id
          console.log("formIcreate :",formId);
          router.push(`/student/${studentId}/prakan/checkPrakan/${req_id}/${formId}`);

        }
      }else{
        if(isEditTime === false){
          let allData = { ...alreadyData, ...studentInfo, ...profileData, time_acc:alreadyData?.time_acc?.split("T")[1]?.substring(0, 5) };
          console.log("submit :",allData);
          const response = await axios.post('/api/prakan/update', allData);
          console.log("responseSubmit",response.data.data)
          console.log("responseId :",response.data.data.id);
          const req_id = response.data.data.req_id
          router.push(`/Admin/prakan/0`);
        }
        else{
          let allData = { ...alreadyData, ...studentInfo, ...profileData};
          console.log("submit :",allData);
          const response = await axios.post('/api/prakan/update', allData);
          console.log("responseSubmit",response.data.data)
          console.log("responseId :",response.data.data.id);
          const req_id = response.data.data.req_id
          router.push(`/Admin/prakan/0`);
        }   
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
            <form className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-7 m-4 md:m-6" onSubmit={handleSubmit}>

                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ชื่อและนามสกุล (Fullname)</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={
                        profileData?.fnameTH + " " + profileData?.lnameTH
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                <label className="block text-gray-700 mt-1">รหัสนิสิต (Student ID)</label>
                  <div>
                    <input
                      type="text"
                      name="id"
                      disabled
                      defaultValue={profileData?.id}
                      className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1">คณะ (Faculty)</label>
                  <div className="">
                    <input
                      type="text"
                      name="faculty"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.facultyNameTH}
                    />
                  </div>
                </div>
                <div>
                  
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >หมายเลขโทรศัพท์ (Phone number)</label>
                  <div>
                    <input
                      type="number"
                      name="phone"
                      onChange={handleChangePhone}
                     className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.phone_num}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                <label className="block text-gray-700 mt-1" >
                    อีเมล (Email)
                    <input
                      type="email"
                      name="email"
                      onChange={handleChangeEmail}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.personal_email}
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ศึกษาในระดับ (Degree)</label>
                  <div>
                    <select
                      name="degree"
                      required
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.degree}
                      onChange={handleChangeDegree}
                    >
                    <option value="">เลือกระดับการศึกษา (select degree)</option>
                    <option value="ปริญญาตรี">ปริญญาตรี (Undergraduate)</option>
                    <option value="บัณฑิตศึกษา">บัณฑิตศึกษา (Graduate)</option>
                  </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ชั้นปีที่ (Academic year)</label>
                  <div>
                    <input
                      type="number"
                      name="year"
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.year}
                      onChange={handleChangeYearLevel}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        <main className="flex justify-center bg-white w-full">
          <div className="bg-white   w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              {" "}
              ข้อมูลการเกิดอุบัติเหตุและการรักษาพาบาล (Accident & treatment details)
            </h3>
            <div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-7 m-4 md:m-6" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  
                  <label className="">
                    
                    <div className="block text-gray-700 mt-1" >
                    เหตุการณ์ขณะเกิดอุบัติเหตุ (Cause of accident)
                    </div>
                    <textarea 
                      className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" cols="23" rows="2" 
                      onChange={handleChangeDesAcc}
                      required
                      value={alreadyData.acc_desc}
                      >
                      </textarea>
                  </label>
                  <div className="text text-xs text-red-600 mt-2">
                  * โปรดระบุตามใบรับรองแพทย์ (Please specify according to the doctor's certificate)
                  </div>
                </div>
                <div className="flex flex-col">
                <label className="">
                    <div className="block text-gray-700 mt-1" >
                    อาการบาดเจ็บ (Description of injury)
                    </div>
                    <textarea 
                      className="w-full px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" cols="32" rows="2" 
                      onChange={handleChangeDesInj}
                      required
                      value={alreadyData.des_injury}
                    >

                    </textarea>
                  </label>
                  <div className="text text-xs text-red-600 mt-2">
                  * โปรดระบุตามใบรับรองแพทย์ (Please specify according to the doctor's certificate)
                  </div>
                </div>
                
                <div className="flex flex-col">
                <label className="block text-gray-700 mt-1" >
                    วันที่เกิดอุบัติเหตุ (Date of accident)
                    <input
                        type="date"
                        max={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                        onChange={handleChangeDateAcc}
                        required
                        value={alreadyData?.acc_date}
                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                  </label>
                </div>
                
                <div className="flex flex-col">
                <label className="block text-gray-700 mt-1" >
                    เวลาเกิดอุบัติเหตุ (Time of accident)
                    <input
                        type="time"
                        onChange={handleChangeTimeAcc}
                        required
                        value={alreadyData?.time_acc?.split("T")[1]?.substring(0, 5)}
                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                  </label>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700" >
                    สถานที่เกิดอุบัติเหตุ (Place of accident)
                  </label>
                  <select
                    onChange={handleChangePlaceAcc}
                    required
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    defaultValue="เลือกสถานที่เกิดอุบัติเหตุ"
                    value={alreadyData.in_university}
                  >
                    <option value="เลือกสถานที่เกิดอุบัติเหตุ" disabled>
                      เลือกสถานที่เกิดอุบัติเหตุ (Select place of accident)
                    </option>
                    <option value={true} className="text-gray-800">ภายในมหาวิทยาลัย (In the university)</option>
                    <option value={false}>ภายนอกมหาวิทยาลัย (Outside the university)</option>
                  </select>
                </div>
                <div className="flex flex-col">
                <label className=" text-gray-700" >
                    ระบุสถานที่เกิดอุบัติเหตุ (Specify the place of accident)
                    </label>
                  <input
                    type="text"
                    name="id"
                    required
                    onChange={handleChangePlaceAccInfo}
                    value={alreadyData.accident_place}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  
                </div>
                <div className="flex flex-col -mt-2">
                  <label className="text text-xs text-red-600 " >
                    * หากเกิดในมหาวิทยาลัย ระบุคณะ/อาคาร/สถานที่ (If on university, specify faculty/building/place of accident)
                  </label>
                </div>
                
                <div className="flex flex-col">
                  <div className="text text-md font-semibold" >
                  สถานพยาบาลที่เข้ารับการรักษา (Place of Treatments)
                  </div>
                  <div className="text text-xs text-red-600 mt-2">
                    * หากเข้ารักษาเกิน 2 ที่ ให้กรอก 2 ที่แรก (If more than 2 places, list the first 2 places)
                  </div>
                </div>
                 <div>
                </div>
                <div className="flex flex-col">
                <div className="flex">
                  <div className="text text-xs text-red-600 mt-1">
                      *&nbsp;
                  </div>
                  <label className="block text-gray-700" >
                    1. ชื่อสถานพยาบาลที่เข้ารับการรักษา (Name of Medical Institution)
                    <input
                      type="text"
                      onChange={handleChangePlaceTreat}
                      required
                      value={alreadyData?.treatment_place}
                      className="w-full -ml-2 px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </label>
                </div>
                </div>
                <div className="flex flex-col">
                <div className="flex">
                <div className="text text-xs text-red-600 mt-1">
                    *
                </div>
                <label className="block text-gray-700 ml-2" >
                    ประเภทสถานพยาบาล (Type of hospital)
                </label>
                </div>
                  <div className="ml-2">
                    <select
                      onChange={handleChangeTypeHos1}
                      required
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.hospital_type ?? 3}
                      
                      
                    >
                        <option value={3} disabled>
                        เลือกประเภท (select type)
                       </option>
                      <option value={0} className="text-gray-800">โรงพยาบาลรัฐ (public hospital)</option>
                      <option value={1}>โรงพยาบาลเอกชน (private hospital)</option>
                      <option value={2}>คลินิก (clinic)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                <label className="block text-gray-700" >
                    2. ชื่อสถานพยาบาลที่เข้ารับการรักษา (Name of Medical Institution)
                    <input
                      type="text"
                      onChange={handleChangePlaceTreat2}
                      value={alreadyData?.treatment_place2}
                      className="w-full  px-1 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </label>
                </div>
                
                <div className="flex flex-col">
                <label className="block text-gray-700" >
                    ประเภทสถานพยาบาล (Type of hospital)
                  </label>
                  <div className="ml-2">
                    <select
                      onChange={handleChangeTypeHos2}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.hospital_type2 ?? 3}
                      disabled={alreadyData?.treatment_place2 === null || alreadyData?.treatment_place2 === "" || isTypeHos2 === false  }
                      required
                      
                    >
                      <option value="">
                        เลือกประเภท (select type)
                       </option>
                      <option value={0} className="text-gray-800">โรงพยาบาลรัฐ (public hospital)</option>
                      <option value={1}>โรงพยาบาลเอกชน (private hospital)</option>
                      <option value={2}>คลินิก (clinic)</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ">
              ค่ารักษาพยาบาลรวมสุทธิ (Net of medical fee total amount)
            </h3>
            <div>
            
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >
                    ตัวเลข (in numbers)
                    <input
                      type="number"
                      onChange={handleChangeMedicalFeeNum}
                      name="medical_fee"
                      required
                      value={alreadyData.medical_fee}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </label>
                </div>
            </div>
          </div>
          <div>

          </div>
          <div>
          {studentId === '0' && (
                <div className="flex justify-start">
                  <button
                    onClick={() => router.push('/Admin/ponpan/0')}
                    className="bg-gray-400 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                  >
                    Back
                  </button>
                </div>
              )}
          </div>
          <div className="flex justify-end">
        
                {studentId !== '0' ? 
                  (   <button
                    
                    htmlType="submit"
                    
                    className="bg-pink-500 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                  >
                    Check data
                  </button>):
                    <button
                  
                    htmlType="submit"
                    
                    className="bg-pink-500 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                  >
                    Save
                  </button>
                }
              
                  </div>
                
              </form>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}
