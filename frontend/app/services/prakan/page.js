
"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header/page.js';
import Dropdown from '../../components/header/dropdown.js';
import PrakanService from '../../../api/prakanService/prakanService.js';
import numberToThaiText from '../../components/numberToThaiText.js';

export default function Form() {
  const [prakanData, setPrakanData] = useState({});
  const prakanService = new PrakanService();
  const [studentInfo, setStudentInfo] = useState({});

   const [inputNumber, setInputNumber] = useState('');
    const [thaiText, setThaiText] = useState('');

    const handleChangeThai = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setInputNumber(value);
            setThaiText(numberToThaiText(parseInt(value)));
            console.log(thaiText);
        }
    };
  
  useEffect(() => {
    let tokens = localStorage.getItem("token");
    const params = {
      token : tokens
    }
    prakanService.cunex(params).then(response => {
      setStudentInfo(response);
      console.log(response);
    })
  },[])




  const handleChangeName = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, name: event.target.value });
  }

  const handleChangeId = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, id: event.target.value });
  }

  const handleChangePhone = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, phone: event.target.value });
  }
  const handleChangeFaculty = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, faculty: event.target.value });
  }
  const handleChangeDesAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desAcc: event.target.value });
  }
  const handleChangeEmail = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, email: event.target.value });
  }
  const handleChangeDesInj = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desInj: event.target.value });
  }
  const handleChangeDateAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, dateAcc: event.target.value });
  }
  const handleChangePlaceAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeAcc: event.target.value });
  }
  const handleChangePlaceTreat = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeTreat: event.target.value });
  }
  const handleChangeTypeHos = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, typeHos: event.target.value });
  }
  const handleChangeMedicalFeeNum = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeNum: event.target.value });
  }
  const handleChangeBankAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, bankAcc: event.target.value });
  }
  const handleChangeMedicalFeeText = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeText: event.target.value });
  }

  const handleSubmit = (event) => {
    console.log(prakanData);
    prakanService.createPrakanForm(prakanData);
  }

  const [bankAccount, setBankAccount] = useState('');
  const [error, setError] = useState('');

  const validateBankAccount = (account) => {
    const regex = /^\d{4}-\d{4}-\d{2}$/; // Format: xxxx-xxxx-xx
    return regex.test(account);
  };

  const formatBankAccount = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the digits to xxxx-xxxx-xx
    const formattedValue = digits.replace(/(\d{4})(\d{4})(\d{0,2})/, '$1-$2-$3');
    return formattedValue;
  };

  const handleChangeAcc = (e) => {
    const { value } = e.target;
    const formattedValue = formatBankAccount(value);
    
    if (validateBankAccount(formattedValue)) {
      setError('');
    } else if (formattedValue.length === 14) {
      setError('Invalid bank account number');
    } else {
      setError('');
    }
    
    setBankAccount(formattedValue);
  };
  
  
  
    return (
    <div className=" bg-white min-h-screen">
      <Header />
      <div className='mx-24'>
      <main className="flex justify-center bg-white w-full">
        <div className="bg-white  w-full min-w-screen-6xl">
        <h3 className="text-md font-semibold mt-8 ml-3">ข้อมูลส่วนตัว (Personal & Contact Information)</h3>
        <div>
        <form className='grid grid-cols-2 gap-7 m-6 bg-white'>
          <div className='flex'>
          <label>
            ชื่อและนามสกุล (Name-Surname):
          </label>
          <div>
          <input type="text" name="name" onChange={handleChangeName} 
            className='ml-2 w-full border border-solid rounded-md border-gray-800'
            value={studentInfo.firstNameTH + ' ' + studentInfo.lastNameTH}
            />
          </div>
          </div>
          <div className='flex'>
          <label>
            หมายเลขโทรศัพท์ (Phone Number):
          </label>
          <div>
          <input type="text" name="phone" onChange={handleChangePhone} 
            className='ml-2 border border-solid rounded-md border-gray-800 w-full'/>
          </div>
          </div>

          <div className='flex'>
          <label>
            คณะ (Faculty):
          </label>
          <div className=''>
          <input type="text" name="faculty" onChange={handleChangeFaculty} 
            className='ml-2 border border-solid rounded-md border-gray-800 w-56'
            value={studentInfo.facultyNameTH}
            />
          </div>
          </div>
          <div>
          <label>
            อีเมลล์ (Email):
            <input type="email" name="email" onChange={handleChangeEmail} 
            className='ml-2 border border-solid rounded-md border-gray-800'
            value={studentInfo.email}
            />
          </label>
          </div>
          <div className='flex'>
          <label>
            รหัสนิสิต (Student ID):
          </label>
          <div >
            <input type="text" name="id" onChange={handleChangeId} 
            className='ml-2 border border-solid rounded-md border-gray-800 w-full' 
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
        <h3 className="text-md font-semibold mt-8 ml-3"> ข้อมุลการเกิดอุบัติเหตุและการรักษาพาบาล (Accident & Treatment(s) Details)</h3>
        <div>
        <form className='grid grid-cols-2 gap-7 m-6 bg-white'>
          <div className=''>
          <label>
          อาการบาดเจ็บ (Description of injury):
            <input type="text" name="name" onChange={handleChangeName} 
            className='ml-2 w-fit border border-solid rounded-md border-gray-800'
            />
          </label>
          </div>
          <div>
          <label>
          ชื่อสถานพยาบาลที่เข้ารับการรักษา (Place of treatment(s)):
            <input type="text" name="phone" onChange={handleChangePhone} 
            className='ml-2 border border-solid rounded-md border-gray-800'/>
          </label>
          </div>
          <div>
          <label>
          วันที่เกิดอุบัติเหตุ (Date of accident) :
            <input type="date" name="faculty" onChange={handleChangeFaculty} 
            className='ml-2 border border-solid rounded-md border-gray-800'/>
          </label>
          </div>
          <div className='flex'>
          <label>
          ประเภทสถานพยาบาล (Type of Hospital) :
            {/* <select type="text" name="email" onChange={handleChangeEmail} 
            className='ml-2 border border-solid rounded-md border-gray-800'/> */}
          </label>
          <div className='ml-2'>
              <Dropdown />
            </div>
          </div>
          <div>
          <label>
          สถานที่เกิดอุบัติเหตุ (Place of accident):
            <input type="text" name="id" onChange={handleChangeId} 
            className='ml-2 border border-solid rounded-md border-gray-800' />
          </label>
          </div>
          <div>
          <label>
          เลขบัญชีธนาคารนิสิต (Bank account number) :
            <input  type="text"
          id="bankAccount"
          value={bankAccount}
          onChange={handleChangeAcc} 
            className='ml-2 border border-solid rounded-md border-gray-800' />
          </label>
          </div>
        </form>
      </div>
              
        </div>
      </main>

      <main className="flex justify-center bg-white w-full">
        <div className="bg-white  w-full min-w-screen-6xl">
        <h3 className="text-md font-semibold mt-8 ml-3">ค่ารักษาพยาบาลรวมสุทธิ (Net of medical fee total amount)</h3>
        <div>
        <form className='grid grid-cols-2 gap-7 m-6 bg-white'>
          <div className=''>
          <label>
          ตัวเลข (in numbers):
            <input type="num" name="name" onChange={handleChangeThai} 
            className='ml-2 w-fit border border-solid  rounded-md border-gray-800'
           />
          </label>
          </div>
          
        </form>
      </div>
              
        </div>
      </main>
      <div className='flex justify-end'>
        <button onClick={handleSubmit} className='bg-pink-300 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11'>
          ส่งฟอร์ม
        </button>
      </div>
      </div>
    

      


    </div>
  );
}
