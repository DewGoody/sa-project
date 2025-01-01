"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../../components/Header.js';
import numberToThaiText from "../../components/numberToThaiText.js";

import { useRouter,useParams } from 'next/navigation';

export default function Form() {
  const [prakanData, setPrakanData] = useState({});
  const [studentInfo, setStudentInfo] = useState({});

  const [inputValue, setInputValue] = useState('');
    const [thaiText, setThaiText] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provinceSelected, setProvinceSelected] = useState('');
    const [amphureSelected, setAmphureSelected] = useState('');
    const [districtSelected, setDistrictSelected] = useState('');

    const router = useRouter();
    const {form} = useParams();

    const fetchProvinces = async () => {
      try {
          const response = await axios.get("/api/Province");
          setProvinces(response.data);
      } catch (err) {
          console.log("Error fetching provinces: " + err);
      }
  };

  const fetchAmphuresById = async (id) => {
    try {
        const response = await axios.get(`/api/Amphure/${id}`);
        setAmphures(response.data);
    } catch (err) {
        console.log("Error fetching amphures: " + err);
    }
};

const fetchDistrictsById = async (id) => {
    try {
        const response = await axios.get(`/api/District/${id}`);
        setDistricts(response.data);
    } catch (err) {
        console.log("Error fetching districts: " + err);
    }
};



useEffect(() => {
  fetchProvinces();
}, []);

console.log("provinces", provinces);
console.log("amphures", amphures);
console.log("districts", districts);

const handleProvinceChange = (e) => {
  const selectedProvince = e.target.value;
  console.log("selectedProvince", selectedProvince);
  setProvinceSelected(selectedProvince);
  fetchAmphuresById(selectedProvince);
}

const handleAmphureChange = (e) => {
  const selectedAmphure = e.target.value;
  console.log("selectedAmphure", selectedAmphure);
  setAmphureSelected(selectedAmphure);
  fetchDistrictsById(selectedAmphure);
}

const handleDistrictChange = (e) => {
  const selectedDistrict = e.target.value;
  console.log("selectedDistrict", selectedDistrict);
  setDistrictSelected(selectedDistrict);
}

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
                <div>
                  ควย1
                </div>
                <div>
                  ควย2
                </div>
                <div>
                  ควย3
                </div>
                <div>
                  
                </div>
                <div>
                  <label className=" text-gray-700 mb-2">จังหวัด (Province)</label>
                  <select
                      name="province"
                      value={provinceSelected}
                      onChange={handleProvinceChange}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                  >
                      <option value="" >เลือกจังหวัด</option>
                      {provinces.map((item, index) => (
                          <option key={index} data-id={item.id} value={item.id}>{item.name_th}</option>
                      ))}
                  </select>
               </div>
          <div>
              <label className=" text-gray-700 mb-2">เขต/อำเภอ (District)</label>
              <select
                  name="amphure"
                  value={amphureSelected}
                  onChange={handleAmphureChange}
                  className="ml-2 border border-solid rounded-md border-gray-800"
              >
                  <option value="">เลือกอำเภอ</option>
                  {amphures.map((amphure, index) => (
                      <option key={index} data-id={amphure.id} value={amphure.id}>{amphure.name_th}</option>
                  ))}
              </select>
          </div>
          <div>
              <label className=" text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
              <select
                  name="district"
                  value={districtSelected}
                  onChange={handleDistrictChange}
                  className="ml-2 border border-solid rounded-md border-gray-800"
              >
                  <option value="">เลือกตำบล</option>
                  {districts.map((district, index) => (
                      <option key={index} data-id={district.id} value={district.id}>{district.nameTh}</option>
                  ))}
              </select>
          </div>
              </form>
            </div>
          </div>

          
        </main>

        
        <div className="flex justify-end">
          <a href="./prakan/checkPrakan">
          <button
            // onClick={handleSubmit}
            
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
