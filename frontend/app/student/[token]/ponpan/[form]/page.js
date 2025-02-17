"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from '../../../../components/Header.js';
import {Input} from 'antd';
import { useRouter,useParams } from 'next/navigation';


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
    const {form} = useParams();
    const {token} = useParams();
    console.log("form : ", form);


    const fetchStudentData = async () => {
      const response = await axios.get('/api/profile'); // Example API
          console.log(response.data);
          setProfileData(response.data);
          setLoading(false);
          console.log(response.data);
    }

    const fetchDataForm = async () => {
      const response = await axios.post(`/api/ponpan/getDataById`, { id: parseInt(form) });
      console.log("resFormData",response.data);
      setPrepareData(response.data.data);
      setAlreadyData(response.data.data);
      setLoading(false);
      console.log(response.data);
    }
          

    useEffect(() => {
      fetchStudentData();
      if(form !== '0'){
        fetchDataForm();
        console.log("formKKK : ", form);
      }

    }, []);

    console.log("prepareData : ", prepareData);
    console.log("alreadyData : ", alreadyData);

    const date = new Date(profileData?.bd);
    const buddhistYear = date.getFullYear() + 543;

    console.log("buddhistYear : ", buddhistYear);

    

    console.log("profileData : ", profileData);

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

const fetchProvincesSD9 = async () => {
  try {
      const response = await axios.get("/api/Province");
      setProvincesSD9(response.data);
  } catch (err) {
      console.log("Error fetching provinces: " + err);
  }
};

const fetchAmphuresSD9ById = async (id) => {
try {
    const response = await axios.get(`/api/Amphure/${id}`);
    setAmphuresSD9(response.data);
} catch (err) {
    console.log("Error fetching amphures: " + err);
}
};

const fetchDistrictsSD9ById = async (id) => {
try {
    const response = await axios.get(`/api/District/${id}`);
    setDistrictsSD9(response.data);
} catch (err) {
    console.log("Error fetching districts: " + err);
}
};


useEffect(() => {
  fetchProvinces();
  fetchProvincesSD9();
}, []);

const handleChangeCitizenId = (e) => {
  setCitizenId(e.target.value);
  setProfileData({ ...profileData, citizenId: e.target.value });
  setAlreadyData({ ...alreadyData, thai_id: e.target.value });
  console.log("citizenId : ", citizenId);
};

const handleChangeYearLevel = (e) => {
  setYearLevel(e.target.value);
  setProfileData({ ...profileData, yearLevel: e.target.value });
  setAlreadyData({ ...alreadyData, year: e.target.value });
  console.log("yearLevel : ", yearLevel);
};

const handleChangeDegree = (e) => {
  setDegree(e.target.value);
  setProfileData({ ...profileData, degree: e.target.value });
  setAlreadyData({ ...alreadyData, degree: e.target.value });
  console.log("degree : ", degree);
};
const handleChangePhoneNum = (e) => {
  setPhoneNum(e.target.value);
  setProfileData({ ...profileData, phoneNum: e.target.value });
  setAlreadyData({ ...alreadyData, phone_num: e.target.value });
  console.log("phoneNum : ", phoneNum);
};

const handleChangeBdDate = (e) => {
  setBdDate(e.target.value);
  console.log("bdDate : ", bdDate);
};

const handleChangeEmail = (e) => {
  setEmail(e.target.value);
  setProfileData({ ...profileData, email: e.target.value });
  setAlreadyData({ ...alreadyData, email: e.target.value });
  console.log("email : ", email);
};

const handleChangeFatherName = (e) => {
  setFatherName(e.target.value);
  setProfileData({ ...profileData, fatherName: e.target.value });
  setAlreadyData({ ...alreadyData, father_name: e.target.value });
  console.log("fatherName : ", fatherName);
};

const handleChangeMotherName = (e) => {
  setMotherName(e.target.value);
  setProfileData({ ...profileData, motherName: e.target.value });
  setAlreadyData({ ...alreadyData, mother_name: e.target.value });
  console.log("motherName : ", motherName);
};

const handleChangeHouseNum = (e) => {
  setHouseNum(e.target.value);
  setAlreadyData({ ...alreadyData, house_num: e.target.value });  
  console.log("houseNum : ", houseNum);
};

const handleChangeHouseMoo = (e) => {
  setHouseMoo(e.target.value);
  setAlreadyData({ ...alreadyData, house_moo: e.target.value });
  console.log("houseMoo : ", houseMoo);
}

const handleChangeHouseNumSD9 = (e) => {
  setHouseNumSD9(e.target.value);
  setAlreadyData({ ...alreadyData, house_num_sd: e.target.value });
  console.log("houseNumSD9 : ", houseNumSD9);
}

const handleChangeHouseMooSD9 = (e) => {
  setHouseMooSD9(e.target.value);
  setAlreadyData({ ...alreadyData, house_moo_sd: e.target.value });
  console.log ("houseMooSD9 : ", houseMooSD9);
}

const handleChangeSd9Num = (e) => {
  setSd9Num(e.target.value);
  setAlreadyData({ ...alreadyData, sdnine_id: e.target.value });
  console.log("sd9Num : ", sd9Num);
}

const handleSubmit = async () => {
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
    router.push(`/student/${token}/ponpan/checkPonpanData/${reqId}`);
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
    router.push(`/student/${token}/ponpan/checkPonpanData/${reqId}`);
    console.log
  }
}

console.log("province : ", province);
console.log("amphure : ", amphures);
console.log("district : ", district);
const handleProvinceChange = (e) => {
  const selectedProvince = e.target.value;
  console.log("selectedProvince", selectedProvince);
  setProvinceSelected(selectedProvince);
  setProvince(provinces[selectedProvince-1].name_th);
  setAlreadyData({ ...alreadyData, province: provinces[selectedProvince-1].name_th });
  fetchAmphuresById(selectedProvince);
}

const handleAmphureChange = (e) => {
  const selectedAmphure = e.target.value;
  console.log("selectedAmphure", selectedAmphure);
  setAmphureSelected(selectedAmphure);
  setAmphure(amphures.find((amphure) => amphure.id === selectedAmphure).name_th);
  setAlreadyData({ ...alreadyData, district: amphures.find((amphure) => amphure.id === selectedAmphure).name_th });
  fetchDistrictsById(selectedAmphure);
}

const handleDistrictChange = (e) => {
  // const selectedDistrict = e.target.value;
  // console.log("selectedDistrict", selectedDistrict);
  // setDistrictSelected(selectedDistrict);
  setDistrict(e.target.value);
  setAlreadyData({ ...alreadyData, sub_district: e.target.value });
}
const handleProvinceSD9Change = (e) => {
  const selectedProvince = e.target.value;
  console.log("selectedProvince", selectedProvince);
  setProvinceSD9Selected(selectedProvince);
  setProvinceSD9(provincesSD9[selectedProvince-1].name_th);
  setAlreadyData({ ...alreadyData, province_sd: provincesSD9[selectedProvince-1].name_th });
  setAlreadyData({ ...alreadyData, province_sd: provincesSD9[selectedProvince-1].name_th });
  fetchAmphuresSD9ById(selectedProvince);
}

const handleAmphureSD9Change = (e) => {
  const selectedAmphure = e.target.value;
  console.log("selectedAmphure", selectedAmphure);
  setAmphureSD9Selected(selectedAmphure);
  setAmphureSD9(amphuresSD9.find((amphure) => amphure.id === selectedAmphure).name_th);
  setAlreadyData({ ...alreadyData, district_sd: amphuresSD9.find((amphure) => amphure.id === selectedAmphure).name_th });
  fetchDistrictsSD9ById(selectedAmphure);
}

const handleDistrictSD9Change = (e) => {
  const selectedDistrict = e.target.value;
  // console.log("selectedDistrict", selectedDistrict);
  // setDistrictSD9Selected(selectedDistrict);
  setDistrictSD9(e.target.value);
  setAlreadyData({ ...alreadyData, subdistrict_sd: e.target.value });
}
  return (
    <div className=" bg-white min-h-screen">
       <Header req1="การขอผ่อนผันการเข้ารับราชการทหาร" req2="Request for deferral of military service" />
      <div className=" mx-24 ">
        <main className="flex justify-center bg-white w-full">
          <div className="bg-white  w-full min-w-screen-6xl">
      
            <h3 className="text-md font-semibold mt-8 ml-3">
              ข้อมูลส่วนตัวนิสิต (Personal & contact information)
            </h3>
            <div>
              <form className="grid grid-cols-2 gap-7 m-6 bg-white">
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >ชื่อและนามสกุล (Fullname-Surname) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      className="ml-2 w-72 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.fnameTH+" "+profileData?.lnameTH}
                    />
                  </div>
                </div>
                <div className="flex">
                <label className="block text-gray-700 mt-1" >รหัสนิสิต (Student ID) :</label>
                  <div>
                    <input
                      type="text"
                      name="id"
                       className="ml-2  px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.id}
                    />
                  </div>
                </div>

                <div className="flex">
                  <label className="block text-gray-700 mt-1" >คณะ (Faculty) :</label>
                  <div className="">
                    <input
                      type="text"
                      name="faculty"
                      className="ml-2 w-72 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={profileData?.facultyNameTH}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >เลขบัตรประชาชน (Identification number) :</label>
                  <div className="">
                    <input
                      type="text"
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={prepareData?.Student?.thai_id || null}
                      onChange={handleChangeCitizenId}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >ชั้นปีที่ (Academic year) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.year}
                      onChange={handleChangeYearLevel}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >ศึกษาในระดับ (Degree) :</label>
                  <div>
                    <select
                      name="degree"
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.degree}
                      onChange={handleChangeDegree}
                    >
                    <option value="">เลือกระดับการศึกษา (select degree)</option>
                    <option value="ปริญญาตรี">ปริญญาตรี (Bachelor)</option>
                    <option value="ปริญาโท">ปริญาโท (Master)</option>
                    <option value="ปริญญาเอก">ปริญญาเอก (Doctorate)</option>
                  </select>
                  </div>
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >ปีเกิด (Birth year) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={buddhistYear}
                      onChange={handleChangeBdDate}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label className="block text-gray-700 mt-1" >หมายเลขโทรศัพท์ (Mobile number) :</label>
                  <div>
                    <input
                      type="text"
                      name="phone"
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.phone_num}
                      onChange={handleChangePhoneNum}
                    />
                  </div>
                </div>
                <div>
                <label className="block text-gray-700 mt-1" >
                    อีเมล (Email) :
                    <input
                      type="email"
                      name="email"
                       className="ml-2 w-72 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={alreadyData?.email}
                      onChange={handleChangeEmail}
                    />
                  </label>
                </div>
                <div>

                </div>
                <div>
                  <div className="flex">
                    <div className="block text-gray-700 mt-1" >ชื่อบิดา (Father's name) :</div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                         className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={alreadyData?.father_name}
                        onChange={handleChangeFatherName}
                      />
                    </div>
                  </div>
                  <div className="font-semibold text-sm text-red-600">
                    ***ไม่ต้องใส่นามสกุล (Do not fill in the surname)
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <div className="block text-gray-700 mt-1" >ชื่อมารดา (Mother's name) :</div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                         className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={alreadyData?.mother_name}
                        onChange={handleChangeMotherName}
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
                <div>
                  <label className=" text-gray-700 mb-2">จังหวัด (Province) : </label>
                  <select
                      name="province"
                      value={provinceSelected}
                      onChange={handleProvinceChange}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                      <option value="" >{alreadyData.province !== undefined ? alreadyData.province : 'เลือกจังหวัด (select province)'}</option>
                      
                      {provinces.map((item, index) => (
                          <option key={index} data-id={item.id} value={item.id}>{item.name_th +" ("+item.name_en+")"}</option>
                      ))}
                  </select>
               </div>
          <div>
              <label className=" text-gray-700 mb-2">เขต/อำเภอ (District) : </label>
              <select
                  name="amphure"
                  value={amphureSelected}
                  onChange={handleAmphureChange}
                   className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                 <option value="" >{alreadyData.district !== undefined ? alreadyData.district : 'เลือกอำเภอ (select district)'}</option>
                  {amphures.map((amphure, index) => (
                      <option key={index} data-id={amphure.id} value={amphure.id}>{amphure.name_th +" ("+amphure.name_en+")"}</option>
                  ))}
              </select>
          </div>
          <div className="flex">
              <label className=" text-gray-700 mb-2">แขวง/ตำบล (Subdistrict) : </label>
              <Input onChange={handleDistrictChange} style={{width:170, marginLeft:20}} value={alreadyData.sub_district} />
          </div>
          <div>

          </div>
          <div className="flex">
                  <label>บ้านเลขที่ (Address number) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={alreadyData.house_num}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleChangeHouseNum}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label>หมู่ที่ (Moo) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={alreadyData.house_moo}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleChangeHouseMoo}
                    />
                  </div>
                </div>


          <div className="-ml-6">
                  <h3 className="text-md font-semibold mt-8 ml-3">
                     ข้อมูลและที่อยู่ตาม สด.9 (Sor dor 9 address)
                  </h3>
                </div>
                <div>
                  
                </div>
                <div className="flex">
                  <label>ใบสำคัญ สด.9 ที่ (Sor Dor 9 certificate) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={alreadyData.sdnine_id}
                       className="ml-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleChangeSd9Num}
                    />
                  </div>
                </div>
                <div>

                </div>
                <div>
                  <label className=" text-gray-700 mb-2">จังหวัด (Province)</label>
                  <select
                      name="province"
                      value={provinceSD9Selected}
                      onChange={handleProvinceSD9Change}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                      <option value="" >{alreadyData.province_sd !== undefined ? alreadyData.province_sd : 'เลือกจังหวัด (select province)'}</option>
                      {provincesSD9.map((item, index) => (
                          <option key={index} data-id={item.id} value={item.id}>{item.name_th +" ("+item.name_en+")"}</option>
                      ))}
                  </select>
               </div>
          <div>
              <label className=" text-gray-700 mb-2">เขต/อำเภอ (District)</label>
              <select
                  name="amphure"
                  value={amphureSD9Selected}
                  onChange={handleAmphureSD9Change}
                   className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                  <option value="" >{alreadyData.district_sd !== undefined ? alreadyData.district_sd : 'เลือกอำเภอ (select district)'}</option>
                  {amphuresSD9.map((amphure, index) => (
                      <option key={index} data-id={amphure.id} value={amphure.id}>{amphure.name_th+" ("+amphure.name_en+")"}</option>
                  ))}
              </select>
          </div>
          <div className="flex">
              <label className=" text-gray-700 mb-2">แขวง/ตำบล (Subdistrict) : </label>
              <Input onChange={handleDistrictSD9Change} style={{width:170, marginLeft:20}} value={alreadyData.subdistrict_sd} />
          </div>
          <div>

          </div>
          <div className="flex">
                  <label>บ้านเลขที่ (Address number) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={alreadyData.house_num_sd}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleChangeHouseNumSD9}
                    />
                  </div>
                </div>
                <div className="flex">
                  <label>หมู่ที่ (Moo) :</label>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={alreadyData.house_moo_sd}
                       className="ml-2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleChangeHouseMooSD9}
                    />
                  </div>
                </div>
              </form>
            </div>
            
          </div>
          
         

          
        </main>

        
        <div className="flex justify-end">
          
          <button
            onClick={handleSubmit}
            htmlType="submit"
            
            className="bg-pink-500 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
          >
            Check data
          </button>

        </div>
      </div>
    </div>
  );
}
