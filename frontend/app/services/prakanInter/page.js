"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/page.js";
import Dropdown from "../../components/header/dropdown.js";
import PrakanService from "../../../api/prakanService/prakanService.js";
import numberToThaiText from "../../components/numberToThaiText.js";

export default function Form() {

  return (
    <div className=" bg-white min-h-screen">
      <header className="bg-gray-100 p-8">
      <div className='flex justify-start'>
        <div>
        <img src="https://www.car.chula.ac.th/carweb2/images/chula_logo.png" alt="profile" 
            className=" h-26 w-16 mx-auto " 
            
        />
        </div>
        <div className='ml-12 rounded-md'>
          <h1 className="font-bold text-2xl text-gray-800">ฝ่ายทุนการศึกษาและบริการนิสิต สำนักบริหารกิจการนิสิต จุฬาลงกรณ์มหาวิทยาลัย</h1>
          <h1 className="texl-ms text-gray-800">Departmet of Schorships & Students Service. Office of the Student Affairs. Chulalongkorn University</h1>
          <h1 className="font-bold text-2xl text-gray-800"> แบบคำขอเรียกร้องค่าสินไหมทดแทนอันเนื่องมาจากอุบัติเหตุ</h1>
          <h1 className="text-ms text-gray-800">Accidental Compensation Claim Form</h1>
        </div>
      </div>
    </header>
    <div className='bg-black h-px '>
    </div>
      <div className=" mx-24 ">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
            <h3 className="text-md font-semibold mt-8 ml-3">
              Personal & Contact Information
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
                  <label>หมายเลขโทรศัพท์ (Phone Number) :</label>
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
              ข้อมุลการเกิดอุบัติเหตุและการรักษาพาบาล (Accident & Treatment(s)
              Details)
            </h3>
            <div>
              <form className="grid grid-cols-2  gap-y-12 gap-x-7 m-6 bg-white">
                <div>
                  <label className="flex">
                    <div>
                    อาการบาดเจ็บ (Description of injury) :
                    </div>
                    {/* <input
                      type="text"
                      name="name"
                      onChange={handleChangeDesInj}
                      className="ml-2 w-fit border border-solid rounded-md border-gray-800 "
                    /> */}
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
                    ชื่อสถานพยาบาลที่เข้ารับการรักษา (Place of Treatment) :
                    <input
                      type="text"
                      name="phone"
                      className="ml-2 border border-solid rounded-md border-gray-800"
                    />
                  </label>
                </div>
                
                <div className="flex">
                <label>
                    ประเภทสถานพยาบาล (Type of Hospital) :
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
                      className="ml-2 w-fit border border-solid  rounded-md border-gray-800"
                    />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </main>
        <div className="flex justify-end">
          <a href="/services/checkPrakan">
          <button
            
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
