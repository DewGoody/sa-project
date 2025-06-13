import * as React from "react";
export const Header = ({ req1, req2 }) => {
  return (
    <>
      <header className=" p-8">
        <div className='flex justify-start'>
          <div>
            <img src="https://www.car.chula.ac.th/carweb2/images/chula_logo.png" alt="profile"
              className=" h-26 w-16 mx-auto "

            />
          </div>
          <div className='ml-12'>
            <h1 className="font-bold text-2xl text-gray-800">ฝ่ายทุนการศึกษาและบริการนิสิต สำนักบริหารกิจการนิสิต จุฬาลงกรณ์มหาวิทยาลัย</h1>
            <h1 className="texl-ms text-gray-800">Division of Scholarships & Student Services, Office of the Student Affairs, Chulalongkorn University</h1>
            <h1 className="font-bold text-2xl text-gray-800"> {req1}</h1>
            <h1 className="text-ms text-gray-800">{req2}</h1>
          </div>
        </div>
      </header>
      <div className='bg-gray-400 h-px '>
      </div>

    </>
  );
}


