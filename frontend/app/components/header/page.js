 // components/Header.js
import React from 'react';

const Header = () => {
  return (
   <>
    <header className="bg-gray-100 p-8">
      <div className='flex justify-start'>
        <div>
        <img src="https://www.car.chula.ac.th/carweb2/images/chula_logo.png" alt="profile" 
            className=" h-26 w-16 mx-auto " 
            
        />
        </div>
        <div className='ml-12'>
          <h1 className="font-bold text-2xl text-gray-800">ฝ่ายทุนการศึกษาและบริการนิสิต สำนักบริหารกิจการนิสิต จุฬาลงกรณ์มหาวิทยาลัย</h1>
          <h1 className="texl-ms text-gray-800">Departmet of Schorships & Students Service. Office of the Student Affairs. Chulalongkorn University</h1>
          <h1 className="font-bold text-2xl text-gray-800"> แบบคำขอเรียกร้องค่าสินไหมทดแทนอันเนื่องมาจากอุบัติเหตุ</h1>
          <h1 className="text-ms text-gray-800">Accidental Compensation Claim Form</h1>
        </div>
      </div>
    </header>
    <div className='bg-black h-px '>
    </div>
      
    </>
  );
};

export default Header;
