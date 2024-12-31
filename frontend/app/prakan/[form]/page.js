"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/page.js";
import numberToThaiText from "../../components/numberToThaiText.js";
import { useRouter,useParams } from 'next/navigation';

export default function Form() {
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
      console.log("kuy",response.data.data);
      const isoDate = response.data.data.acc_date;
      const formattedDate = isoDate.split("T")[0];
      setDate(formattedDate); 
      const thaiText = numberToThaiText(response.data.data.medical_fee);
      response.data.data.thaiText = thaiText
      response.data.data.formId = form
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
            setPrakanData({ ...prakanData, thaiText: thaiText , medical_fee: value});
            setAlreadyData({ ...alreadyData, thaiText: thaiText , medical_fee: value});
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
   console.log(typeof event.target.value,event.target.value);
   setDate(event.target.value)
  setPrakanData({ ...prakanData, acc_date: event.target.value  });

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
    console.log(event.target.value);
    setPrakanData({ ...prakanData, hospital_type: event.target.value });
    setAlreadyData({ ...alreadyData, hospital_type: event.target.value });
  };
  const handleChangeMedicalFeeNum = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medical_fee: (event.target.value)});
  };

  const handleSubmit = async (event) => {
    

    try {
      if(form !== '0'){
        let allData = { ...alreadyData, ...studentInfo, ...thaiText, ...profileData };
        console.log("prakanSubmit : ",thaiText);
        console.log("prakanAllData",allData);
        const response = await axios.post('/api/prakan/update', allData);
        console.log("responseId :",response.data.data.id);
        router.push(`/prakan/checkPrakan/${form}`);
      }else{
        let allData = { ...prakanData, ...studentInfo, ...thaiText, ...profileData };
        console.log("prakanSubmit : ",thaiText);
        console.log("prakanAllData",allData);
        const response = await axios.post('/api/prakan/create', allData);
        const formId = response.data.data.id
        router.push(`/prakan/checkPrakan/${formId}`);
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className=" bg-white min-h-screen">
      <Header />
      <div className=" mx-24 ">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              ข้อมูลส่วนตัว (Personal & contact information)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="flex">
                  <label>ชื่อและนามสกุล (Name-Surname) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      defaultValue={profileData.fnameTH + " " + profileData.lnameTH}
                      className="ml-2 w-full border border-solid rounded-md border-gray-800"
                      value={
                        profileData.fnameTH + " " + profileData.lnameTH
                      }
                    />
                  </div>
                </div>
                <div className="flex">
                <label>รหัสนิสิต (Student ID) :</label>
                  <div>
                    <input
                      type="text"
                      name="id"
                      defaultValue={profileData.id}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-full"
                      
                    />
                  </div>
                </div>

                <div className="flex">
                  <label>คณะ (Faculty) :</label>
                  <div className="">
                    <input
                      type="text"
                      name="faculty"
                     defaultValue={profileData.facultyNameTH}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-56"
                      value={studentInfo.facultyNameTH}
                    />
                  </div>
                </div>
                <div>
                  
                </div>
                <div className="flex">
                  <label>หมายเลขโทรศัพท์ (Phone number) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePhone}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-full"
                      value={profileData.tel_num}
                    />
                  </div>
                </div>
                <div>
                <label>
                    อีเมลล์ (Email) :
                    <input
                      type="email"
                      name="email"
                      onChange={handleChangeEmail}
                      className="ml-2 border border-solid rounded-md border-gray-800"
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
                    <div>
                    อาการบาดเจ็บ (Description of injury) :
                    </div>
                    <textarea 
                      className="ml-2 border border-solid rounded-md border-black" cols="32" rows="2" 
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
                    
                    <div>
                    การเกิดอุบัติเหตุ (Description of accident) :
                    </div>
                    <textarea 
                      className="ml-2 border border-solid rounded-md border-black" cols="23" rows="2" 
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
                <label>
                    ชื่อสถานพยาบาลที่เข้ารับการรักษา (Place of treatment) :
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePlaceTreat}
                      value={alreadyData.treatment_place}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                
                <div className="flex">
                <label>
                    ประเภทสถานพยาบาล (Type of hospital) :
                  </label>
                  <div className="ml-2">
                    <select
                      onChange={handleChangeTypeHos}
                      className="border border-solid rounded-md border-gray-800 text-gray-800 "
                      defaultValue="เลือกประเภทสถานพยาบาล"
                      value={alreadyData.hospital_type}
                      
                      
                    >
                      <option value="เลือกประเภทสถานพยาบาล" disabled>
                        เลือกประเภท (Select type)
                       </option>
                      <option value="โรงพยาบาลรัฐ" className="text-gray-800">โรงพยาบาลรัฐ (public hospital)</option>
                      <option value="โรงพยาบาลเอกชน">โรงพยาบาลเอกชน (private hospital)</option>
                      <option value="คลินิก">คลินิก (clinic)</option>
                    </select>
                  </div>
                </div>
                <div className="flex">
                <label>
                    วันที่เกิดอุบัติเหตุ (Date of accident) :
                    <input
                      type="date"
                      onChange={handleChangeDateAcc}
                      value={date}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    สถานที่เกิดอุบัติเหตุ (Place of accident) :
                    <input
                      type="text"
                      name="id"
                      onChange={handleChangePlaceAcc}
                      value={alreadyData.accident_place}
                      className="ml-2 border border-solid rounded-md border-gray-800"
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
                  <label>
                    ตัวเลข (in numbers) :
                    <input
                      type="num"
                      onChange={handleChangeThai}
                      value={alreadyData.medical_fee}
                      className="ml-2 w-fit border border-solid  rounded-md border-gray-800"
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
            
            className="bg-pink-300 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
          >
            Next
          </button>
    
        </div>
      </div>
    </div>
  );
}