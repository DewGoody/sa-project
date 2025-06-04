"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../../../../../components/Header.js';
import { Input } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { QuestionCircleOutlined } from '@ant-design/icons';
import RedirectOnBack from './RedirectOnBack';

export default function Form() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stuId, setStuId] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [degree, setDegree] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [houseNum, setHouseNum] = useState('');
  const [houseMoo, setHouseMoo] = useState('');
  const [houseNumSD9, setHouseNumSD9] = useState('');
  const [houseMooSD9, setHouseMooSD9] = useState('');
  const [sd9Num, setSd9Num] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [province, setProvince] = useState('');
  const [amphure, setAmphure] = useState('');
  const [district, setDistrict] = useState('');
  const [provinceSD9, setProvinceSD9] = useState('');
  const [amphureSD9, setAmphureSD9] = useState('');
  const [districtSD9, setDistrictSD9] = useState('');
  const [provincesSD9, setProvincesSD9] = useState([]);
  const [amphuresSD9, setAmphuresSD9] = useState([]);
  const [districtsSD9, setDistrictsSD9] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState('');
  const [amphureSelected, setAmphureSelected] = useState('');
  const [districtSelected, setDistrictSelected] = useState('');
  const [provinceSD9Selected, setProvinceSD9Selected] = useState('');
  const [amphureSD9Selected, setAmphureSD9Selected] = useState('');
  const [districtSD9Selected, setDistrictSD9Selected] = useState('');
  const [bdDate, setBdDate] = useState('');

  //noData
  const [prepareData, setPrepareData] = useState('');
  const [alreadyData, setAlreadyData] = useState('');

  console.log("provinceSelected : ", provinceSelected);


  const router = useRouter();
  const { form } = useParams();
  const { studentId } = useParams();
  console.log("form : ", form);


  const fetchStudentData = async () => {
    const response = await axios.get('/api/profile');
    console.log(response.data);
    setProfileData(response.data);
    setLoading(false);
    console.log(response.data);
  }

  const fetchDataForm = async () => {
    const response = await axios.post(`/api/ponpan/getDataById`, { id: parseInt(form) });
    console.log("resFormData", response.data);
    setPrepareData(response.data.data);
    setAlreadyData(response.data.data);
    setProfileData(response.data.data.Student);
    setLoading(false);
    console.log(response.data);
  }


  useEffect(() => {
    if (studentId !== '0') {
      fetchStudentData();
      if (form !== '0') {
        fetchDataForm();
        console.log("formKKK : ", form);
      }
    } else {
      fetchDataForm();
    }

  }, []);

  console.log("prepareData : ", prepareData);
  console.log("alreadyData : ", alreadyData);

  const date = new Date(profileData?.bd);
  const buddhistYear = date.getFullYear() + 543;

  const alreadyDate = new Date(alreadyData?.Student?.bd);
  const alreadyBuddhistYear = alreadyDate.getFullYear() + 543;

  console.log("buddhistYear : ", buddhistYear);



  console.log("profileData : ", profileData);



  const handleSubmit = async () => {
    if (studentId !== '0') {
      if (form === '0') {
        const data = {
          stu_id: profileData.id,
          thai_id: citizenId,
          year: yearLevel,
          degree: degree,
          phone_num: phoneNum,
          email: email,
          father_name: fatherName,
          mother_name: motherName,
          house_num: houseNum,
          house_moo: houseMoo,
          house_num_sd: houseNumSD9,
          house_moo_sd: houseMooSD9,
          sdnine_id: sd9Num,
          province: province,
          district: amphure,
          sub_district: district,
          province_sd: provinceSD9,
          district_sd: amphureSD9,
          subdistrict_sd: districtSD9,
        };

        const response = await axios.post("/api/ponpan/create", data);
        const reqId = response.data.data.req_id;
        console.log(response.data);
        router.push(`/student/${studentId}/ponpan/checkPonpanData/${reqId}/${form}`);
        console.log(data);
      } else {
        const data = {
          id: alreadyData.id,
          stu_id: profileData.id,
          thai_id: citizenId,
          year: alreadyData.year,
          degree: alreadyData.degree,
          phone_num: alreadyData.phone_num,
          email: alreadyData.email,
          father_name: alreadyData.father_name,
          mother_name: alreadyData.mother_name,
          house_num: alreadyData.house_num,
          house_moo: alreadyData.house_moo,
          house_num_sd: alreadyData.house_num_sd,
          house_moo_sd: alreadyData.house_moo_sd,
          sdnine_id: alreadyData.sdnine_id,
          province: alreadyData.province,
          district: alreadyData.district,
          sub_district: alreadyData.sub_district,
          province_sd: alreadyData.province_sd,
          district_sd: alreadyData.district_sd,
          subdistrict_sd: alreadyData.subdistrict_sd,
        };

        const response = await axios.post("/api/ponpan/update", data);
        const reqId = response.data.data.req_id;
        console.log(response.data);
        router.push(`/student/${studentId}/ponpan/checkPonpanData/${reqId}/${form}`);
        console.log
      }
    }
    else {
      const data = {
        id: alreadyData.id,
        stu_id: alreadyData?.Student?.id,
        thai_id: citizenId,
        year: alreadyData.year,
        degree: alreadyData.degree,
        phone_num: alreadyData.phone_num,
        email: alreadyData.email,
        father_name: alreadyData.father_name,
        mother_name: alreadyData.mother_name,
        house_num: alreadyData.house_num,
        house_moo: alreadyData.house_moo,
        house_num_sd: alreadyData.house_num_sd,
        house_moo_sd: alreadyData.house_moo_sd,
        sdnine_id: alreadyData.sdnine_id,
        province: alreadyData.province,
        district: alreadyData.district,
        sub_district: alreadyData.sub_district,
        province_sd: alreadyData.province_sd,
        district_sd: alreadyData.district_sd,
        subdistrict_sd: alreadyData.subdistrict_sd,
      };

      const response = await axios.post("/api/ponpan/update", data);
      // const reqId = response.data.data.req_id;
      console.log("resAdminSubmit", response.data);
      router.push(`/Admin/ponpan/0`);
      console.log
    }
  }


  return (
    <>
    <RedirectOnBack />
    <div className=" bg-white min-h-screen">
      <Header req1="การขอผ่อนผันการเข้ารับราชการทหาร" req2="Request for deferral of military service" />
      <div className=" mx-24 ">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">

            <h3 className="text-md font-semibold mt-8 ml-3">
              ข้อมูลส่วนตัวนิสิต (Personal & contact information)
            </h3>
            <div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-7 m-4 md:m-6">
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ชื่อและนามสกุล (Fullname) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      value={profileData?.fnameTH + " " + profileData?.lnameTH}

                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >รหัสนิสิต (Student ID) :</label>
                  <div>
                    <input
                      type="text"
                      disabled
                      name="id"
                      className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      value={profileData?.id}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >คณะ (Faculty) :</label>
                  <div className="">
                    <input
                      type="text"
                      disabled
                      name="faculty"
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      value={profileData?.facultyNameTH}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >เลขบัตรประชาชน (Identification number) :</label>
                  <div className="">
                    <input
                      type="text"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={prepareData?.Student?.thai_id || null}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ชั้นปีที่ (Academic year) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.year}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ศึกษาในระดับ (Degree) :</label>
                  <div>
                    <input
                      name="degree"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.degree}
                    />

                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >ปีเกิด (Birth year) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      value={profileData !== null ? buddhistYear : alreadyBuddhistYear}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >หมายเลขโทรศัพท์ (Mobile number) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      disabled
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.phone_num}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-700 mt-1" >
                    อีเมล (Email) :
                    <input
                      type="email"
                      name="email"
                      disabled
                      className=" w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.email}
                    />
                  </label>
                </div>
                <div>

                </div>
                <div >
                  <div className="flex flex-col">
                    <div className="block text-gray-700 mt-1" >ชื่อบิดา (Father's name) :</div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        disabled
                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={alreadyData?.father_name}
                      />
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-red-600">
                    ***ไม่ต้องใส่นามสกุล (Do not fill in the surname)
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <div className="block text-gray-700 mt-1" >ชื่อมารดา (Mother's name) :</div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        disabled
                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={alreadyData?.mother_name}
                      />
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-red-600">
                    ***ไม่ต้องใส่นามสกุล (Do not to fill in the surname)
                  </div>
                </div>

                <div className="-ml-6">
                  <h3 className="text-md font-semibold mt-8 ml-3">
                    ที่อยู่ตามทะเบียนบ้าน (Residential address)
                  </h3>
                </div>
                <div>

                </div>
                <div className="flex flex-col text-gray-700">
                  <label>บ้านเลขที่ (Address number) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={alreadyData.house_num}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-gray-700">
                  <label>หมู่ที่ (Moo) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={alreadyData.house_moo}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">จังหวัด (Province) : </label>
                  <input
                    name="province"
                    disabled
                    value={alreadyData.province}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">เขต/อำเภอ (District) : </label>
                  <input
                    name="amphure"
                    disabled
                    value={alreadyData.district}
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">แขวง/ตำบล (Subdistrict) : </label>
                  <input
                    disabled
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" value={alreadyData.sub_district} />
                </div>
                <div>

                </div>



                <div className="-ml-6">
                  <h3 className="text-md font-semibold mt-8 ml-3">
                    ข้อมูลและที่อยู่ตาม สด.9 (Sor dor 9 address)
                  </h3>
                </div>
                <div>

                </div>
                <div className="flex flex-col">
                  <label>ใบสำคัญ สด.9 ที่ (Sor Dor 9 certificate) :</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={alreadyData.sdnine_id}
                      className="w-full py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="mt-1">
                      <a
                        href="/Sd9num-1.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <QuestionCircleOutlined style={{ color: "red", fontSize: "larger", marginLeft: "10px" }} />
                      </a>
                    </div>
                  </div>
                </div>

                <div>

                </div>
                <div className="flex flex-col text-gray-700">
                  <label>บ้านเลขที่ (Address number) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={alreadyData.house_num_sd}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-gray-700">
                  <label>หมู่ที่ (Moo) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      disabled
                      value={alreadyData.house_moo_sd}
                      className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">จังหวัด (Province)</label>
                  <input
                    name="province"
                    value={alreadyData.province_sd}
                    disabled
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                  <input
                    name="amphure"
                    value={alreadyData.district_sd}
                    disabled
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex flex-col">
                  <label className=" text-gray-700 mb-2">แขวง/ตำบล (Subdistrict) : </label>
                  <input
                    disabled
                    className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" value={alreadyData.subdistrict_sd} />
                </div>
                <div>

                </div>

              </form>
            </div>

          </div>




        </main>


        <div className="flex justify-end">

          {studentId !== '0' ?
            (<button
              onClick={handleSubmit}
              htmlType="submit"

              className="bg-pink-500 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
            >
              Check documents
            </button>) :
            <button
              onClick={handleSubmit}
              htmlType="submit"

              className="bg-pink-500 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
            >
              เสร็จสิ้น
            </button>
          }

        </div>
      </div>
    </div></>
  );
}
