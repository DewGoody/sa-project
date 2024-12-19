"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../components/Header';
import numberToThaiText from "../components/numberToThaiText.js";

export default function Form() {
  const [prakanData, setPrakanData] = useState({});
  const [studentInfo, setStudentInfo] = useState({});

  const [inputValue, setInputValue] = useState('');
    const [thaiText, setThaiText] = useState('');
    const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className=" bg-white min-h-screen">
       <Header req1="การขอผ่อนผันการเข้ารับราชการทหาร" req2="" />
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
                      className="ml-2 w-full border border-solid rounded-md border-gray-800"
                    />
                  </div>
                </div>
                <div className="flex">
                <label>รหัสนิสิต (Student ID) :</label>
                  <div>
                    <input
                      type="text"
                      name="id"
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
                      className="ml-2 border border-solid rounded-md border-gray-800 w-56"
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
                      className="ml-2 border border-solid rounded-md border-gray-800 w-full"
                    />
                  </div>
                </div>
                <div>
                <label>
                    อีเมลล์ (Email) :
                    <input
                      type="email"
                      name="email"
                      className="ml-2 border border-solid rounded-md border-gray-800"
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
                    <textarea className="ml-2 border border-solid rounded-md border-black" cols="32" rows="2" ></textarea>
                  </label>
                  <div className="text text-sm text-red-600 mt-2">
                  * โปรดระบุตามใบรับรองแพทย์ (Please specify according to the doctor's certificate)
                  </div>
                </div>
                <div>
                <label>
                    การเกิดอุบัติเหตุ (Description of accident) :
                    <input
                      type="text"
                      name="faculty"
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
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
                      className="border border-solid rounded-md border-gray-800 text-gray-800 "
                      defaultValue="เลือกประเภทสถานพยาบาล"
                      
                      
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
                      className="ml-2 w-fit border border-solid  rounded-md border-gray-800"
                    />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </main>
        <div className="flex justify-end">
          <a href="./prakan/checkPrakan">
          <button
            onClick={handleSubmit}
            
            className="bg-pink-300 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
          >
            ถัดไป
          </button>
          </a>
        </div>
      </div>
    </div>
  );
}
