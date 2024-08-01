"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/page.js";
import Dropdown from "../../components/header/dropdown.js";
import PrakanService from "../../../api/prakanService/prakanService.js";
import numberToThaiText from "../../components/numberToThaiText.js";

export default function Form() {
  const [prakanData, setPrakanData] = useState({});
  const prakanService = new PrakanService();
  const [studentInfo, setStudentInfo] = useState({});

  const [inputNumber, setInputNumber] = useState("");
  const [thaiText, setThaiText] = useState({});

  const handleChangeThai = (e) => {
    handleChangeMedicalFeeNum(e);
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputNumber(value);
      setThaiText({ thaiText: numberToThaiText(parseInt(value)) });
      console.log(typeof thaiText);
      console.log(thaiText);
    }
  };

  useEffect(() => {
    let tokens = localStorage.getItem("token");
    const params = {
      token: tokens,
    };
    prakanService.cunex(params).then((response) => {
      setStudentInfo(response);
      console.log(response);
    });
  }, []);

  const handleChangeName = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, name: event.target.value });
  };

  const handleChangeId = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, id: event.target.value });
  };

  const handleChangePhone = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, phone: event.target.value });
  };
  const handleChangeFaculty = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, faculty: event.target.value });
  };
  const handleChangeDesAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desAcc: event.target.value });
  };
  const handleChangeEmail = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, emailType: event.target.value });
  };
  const handleChangeDesInj = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desInj: event.target.value });
  };
  const handleChangeDateAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, dateAcc: event.target.value });
  };
  const handleChangePlaceAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeAcc: event.target.value });
  };
  const handleChangePlaceTreat = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeTreat: event.target.value });
  };
  const handleChangeTypeHos = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, typeHos: event.target.value });
  };
  const handleChangeMedicalFeeNum = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeNum: event.target.value });
  };
  const handleChangeBankAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, bankAcc: event.target.value });
  };
  const handleChangeMedicalFeeText = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeText: event.target.value });
  };

  const handleSubmit = (event) => {
    let allData = { ...prakanData, ...studentInfo, ...thaiText };
    console.log(prakanData);
    console.log(allData);
    prakanService.createPrakanForm(allData);
  };
  const [accountNumber, setAccountNumber] = useState('');

  const formatAccountNumber = (value) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Format the number according to the pattern "101-2-23456-1"
    const part1 = numericValue.slice(0, 3);
    const part2 = numericValue.slice(3, 4);
    const part3 = numericValue.slice(4, 9);
    const part4 = numericValue.slice(9, 10);

    let formattedValue = part1;
    if (part2) formattedValue += `-${part2}`;
    if (part3) formattedValue += `-${part3}`;
    if (part4) formattedValue += `-${part4}`;

    return formattedValue;
  };

  const handleChangeAcc = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value.replace(/-/g, ''))) {
      setAccountNumber(formatAccountNumber(value));
      setPrakanData({ ...prakanData, bankAcc: formatAccountNumber(value) });
    }
  };

  return (
    <div className=" bg-white min-h-screen">
      <Header />
      <div className="mx-24">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              ข้อมูลส่วนตัว (Personal & Contact Information)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="flex">
                  <label>ชื่อและนามสกุล (Name-Surname):</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      onChange={handleChangeName}
                      className="ml-2 w-full border border-solid rounded-md border-gray-800"
                      value={
                        studentInfo.firstNameTH + " " + studentInfo.lastNameTH
                      }
                    />
                  </div>
                </div>
                <div className="flex">
                  <label>หมายเลขโทรศัพท์ (Phone Number):</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePhone}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-full"
                    />
                  </div>
                </div>

                <div className="flex">
                  <label>คณะ (Faculty):</label>
                  <div className="">
                    <input
                      type="text"
                      name="faculty"
                      onChange={handleChangeFaculty}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-56"
                      value={studentInfo.facultyNameTH}
                    />
                  </div>
                </div>
                <div>
                  <label>
                    อีเมลล์ (Email):
                    <input
                      type="email"
                      name="email"
                      onChange={handleChangeEmail}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div className="flex">
                  <label>รหัสนิสิต (Student ID):</label>
                  <div>
                    <input
                      type="text"
                      name="id"
                      onChange={handleChangeId}
                      className="ml-2 border border-solid rounded-md border-gray-800 w-full"
                      value={studentInfo.studentId}
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
              ข้อมุลการเกิดอุบัติเหตุและการรักษาพาบาล (Accident & Treatment(s)
              Details)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="">
                  <label>
                    อาการบาดเจ็บ (Description of injury):
                    <input
                      type="text"
                      name="name"
                      onChange={handleChangeDesInj}
                      className="ml-2 w-fit border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    ชื่อสถานพยาบาลที่เข้ารับการรักษา (Place of treatment(s)):
                    <input
                      type="text"
                      name="phone"
                      onChange={handleChangePlaceTreat}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    การเกิดอุบัติเหตุ (Description of accident) :
                    <input
                      type="text"
                      name="faculty"
                      onChange={handleChangeDesAcc}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    วันที่เกิดอุบัติเหตุ (Date of accident) :
                    <input
                      type="date"
                      name="faculty"
                      onChange={handleChangeDateAcc}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div className="flex">
                  <label>
                    ประเภทสถานพยาบาล (Type of Hospital) :
                    {/* <select type="text" name="email" onChange={handleChangeEmail} 
            className='ml-2 border border-solid rounded-md border-gray-800'/> */}
                  </label>
                  <div className="ml-2">
                    <select
                      onChange={handleChangeTypeHos}
                      className="border border-solid rounded-md border-gray-800 text-gray-500 "
                      defaultValue="เลือกประเภทสถานพยาบาล"
                      
                      
                    >
                      <option value="เลือกประเภทสถานพยาบาล" disabled>
                        เลือกประเภทสถานพยาบาล
                       </option>
                      <option value="โรงพยาบาลรัฐ">โรงพยาบาลรัฐ</option>
                      <option value="โรงพยาบาลเอกชน">โรงพยาบาลเอกชน</option>
                      <option value="คลินิก">คลินิก</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label>
                    สถานที่เกิดอุบัติเหตุ (Place of accident):
                    <input
                      type="text"
                      name="id"
                      onChange={handleChangePlaceAcc}
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    เลขบัญชีธนาคารนิสิต (Bank account number) :
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={handleChangeAcc}
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
                    ตัวเลข (in numbers):
                    <input
                      type="num"
                      name="name"
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
          <button
            onClick={handleSubmit}
            className="bg-pink-300 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
          >
            ส่งฟอร์ม
          </button>
        </div>
      </div>
    </div>
  );
}
