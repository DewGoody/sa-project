'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../components/Header';
import { useGoldenContext } from '../../contexts/GoldenData';
import { useParams, useRouter } from 'next/navigation';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const notifyerror = () => {
    toast.error('👆🏻 กรอกข้อมูลให้ถูกต้อง', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
    });
}
const notifyinprocess = () => {
    toast.info('Inprocess', {
        position: "bottom-right",

        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
    });
}
const notifysuccess = () => {
    toast.success('Succes', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
    });
}
const page = () => {
    const { form } = useParams()
    const router = useRouter();
    const { Data, updateData } = useGoldenContext();
    const { updateDataid } = useGoldenContext(); // ใช้ context
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const int_req_id = parseInt(form)
    useEffect(() => {
        if (form) {
            updateDataid({ int_req_id }); // Pass form to the context
        }
    }, [form, updateData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
        if (name === "province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresById(id);
        } else if (name === "amphure") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsById(id);
        }

        // เคลียร์ค่า hospitalName เมื่อ benefitStatus ไม่ใช่ "existing"
        if (name === "benefitStatus" && value !== "existing") {
            updateData({ hospitalName: '' });
        }
        if (name === "benefitStatus" && value !== "other") {
            updateData({ otherStatus: '' });
        }
    };

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
    var isTrueSet = (CH) => (String(CH).toLowerCase() === 'true');
    useEffect(() => {
        fetchProvinces();

    }, []);
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const handleSubmit = async (e) => {
        console.log(int_req_id)

        const status_before = () => {
            if (Data.benefitStatus === "existing") {
                // console.log("exxxxxxxxxx")
                return Data.hospitalName
            }
            else if (Data.benefitStatus === "other") {
                // console.log("other")
                return Data.otherStatus
            }
        }
        const id = Data.id
        e.preventDefault();
        try {
            notifyinprocess()
            await axios.put(`/api/UHC?id=${int_req_id}`, {
                Student: {
                    id: id,
                    lnameTH: Data.Name,
                    fnameTH: Data.Surname,
                    facultyNameTH: Data.facultyNameTH,
                    year: Data.year,
                    bd: formatDateToISO(Data.birthDate),
                    tel_num: Data.Telnumber,
                    title: Data.Nametitle,
                    thai_id: Data.citizenId,
                    contactable_tel: Data.Contactphone,
                    thai_id_card_issured: formatDateToISO(Data.Idcardissuedate),
                    thai_id_card_expired: formatDateToISO(Data.Idcardexpiraiton),
                    personal_email: Data.email,
                    // contactable_tel: Data.Phonenumber,
                },
                UHC_reg_info: {
                    id: id,
                    smart_card_issured: Data.Idcardissuedate,
                    smart_card_expired: Data.Idcardissuedate,
                    status_before_reg: Data.benefitStatus,
                    status_info: status_before(),
                    frequence_uses: Data.hospitalService,
                    is_been: isTrueSet(Data.usedHospitalBefore),
                    is_congenital_disease: isTrueSet(Data.hasChronicDisease),
                },
                DOPA_address: {
                    id: id,
                    house_num: Data.domicileNumber,
                    house_moo: Data.house_moo,
                    soi: Data.soi,
                    street: Data.road,
                    subdistrict: Data.amphure,
                    district: Data.district,
                    province: Data.provice,
                    postal_code: Data.zipCode,
                }
            })


            notifysuccess()
            router.push(`/golden_card/Doc/${int_req_id}`)
        } catch (error) {
            notifyerror()
            console.error('Form submission error:', error);
            // router.push("/golden_card/Doc")
        }
    };


    return (
        <div>
            <Header req1="แบบคำขอรับรองคุณสมบัติในการเข้าร่วมโครงการประกันสุขภาพถ้วนหน้า (กรุงเทพมหานคร) สำหรับสินิตจุฬาลงกรณ์มหาวิทยาลัย และ หนังสือข้อตกลงขอขึ้นทะเบียนบัตรประกันสุขภาพถ้วนหน้า โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย" req2="" />
            <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">
                <main className="flex justify-center items-center ">
                    <div className="bg-white p-8 w-full ">
                        <section className="ml-5">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-semibold mb-4 ">
                                    ข้อมูลส่วนตัว (Personal information)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full  ">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">คำนำหน้า (Prefix)</label>
                                            <input
                                                type="text"
                                                name="Nametitle"
                                                value={Data.Nametitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nametitle"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                                            <input
                                                type="text"
                                                name="Name"
                                                value={Data.Name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Name-Surname"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">สกุล (Surname)</label>
                                        <input
                                            type="text"
                                            name="Surname"
                                            value={Data.Surname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Surname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">คณะ (Faculty)</label>
                                        <input
                                            type="text"
                                            name="facultyNameTH"
                                            value={Data.facultyNameTH}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Faculty"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">ชั้นปี (Year)</label>
                                        <input
                                            type="text"
                                            name="year"
                                            value={Data.year}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Year"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขบัตรประชาชน (Citizen ID)</label>
                                        <input
                                            type="text"
                                            name="citizenId"
                                            value={Data.citizenId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Citizen ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">วันที่ออกบัตรประชาชน (ID card issue date)</label>
                                        <input
                                            type="date"
                                            name="Idcardissuedate"
                                            value={Data.Idcardissuedate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">วันที่บัตรบัตรประชาชนหมดอายุ (ID card expiration date)</label>
                                        <input
                                            type="date"
                                            name="Idcardexpiraiton"
                                            value={Data.Idcardexpiraiton}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                    <div className="flex item-center space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">วันเกิด (Birth date)</label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={Data.birthDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Birth Date"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อาชีพ (Job)</label>
                                            <input
                                                type="text"
                                                name="Job"
                                                value={Data.Job}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Job"
                                            />
                                        </div>
                                    </div>

                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์มือถือ (Phone number)</label>
                                        <input
                                            type="text"
                                            name="Phonenumber"
                                            value={Data.Phonenumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">หมายเลขโทรศัพท์ที่ติดต่อได้ (Contact phone number)</label>
                                        <input
                                            type="text"
                                            name="Contactphone"
                                            value={Data.Contactphone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Contact phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">E-mail</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={Data.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="E-mail"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                    ที่อยู่จริงตามทะเบียนบ้าน (Current address)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขที่บ้าน (Domicile number)</label>
                                        <input
                                            type="text"
                                            name="domicileNumber"
                                            value={Data.domicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Domicile Number"
                                        />
                                    </div>                  <div>
                                        <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                        <input
                                            type="text"
                                            name="house_moo"
                                            value={Data.house_moo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Moo"
                                        />
                                    </div>                  <div>
                                        <label className="block text-gray-700 mb-2">ตรอก/ซอย (Soi)</label>
                                        <input
                                            type="text"
                                            name="soi"
                                            value={Data.soi}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Soi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                                        <input
                                            type="text"
                                            name="road"
                                            value={Data.road}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Road"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="province"
                                            value={Data.province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.province}>{Data.province}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="amphure"
                                            value={Data.amphure}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.amphure}>{Data.amphure}</option>
                                            {amphures.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <select
                                            name="district"
                                            value={Data.district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.district}>{Data.district}</option>
                                            {districts.map((district, index) => (
                                                <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <select
                                            name="zipCode"
                                            value={Data.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.zipCode}>{Data.zipCode}</option>
                                            {districts.map((district, index) => (
                                                <option key={index} value={district.zipCode}>{district.zipCode}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์ (Tel number)</label>
                                        <input
                                            type="text"
                                            name="Telnumber"
                                            value={Data.Telnumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Tel number"
                                        />
                                    </div>

                                </div>


                                <h3 className="text-lg font-semibold mb-4 pt-10 ">
                                    สถานะก่อนลงทะเบียน (Pre-registration status)
                                </h3>
                                <div>
                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="existing"
                                            name="benefitStatus"
                                            value="existing"
                                            checked={Data.benefitStatus === "existing"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="existing" className="block text-gray-700">
                                            สิทธิหลักประกันสุขภาพแห่งชาติ โรงพยาบาล
                                            <input
                                                type="text"
                                                name="hospitalName"
                                                onChange={handleChange}
                                                value={Data.hospitalName}
                                                className="border rounded-lg px-2 py-1 ml-2"
                                                placeholder="ชื่อโรงพยาบาล" // กำหนด placeholder เริ่มต้น
                                                disabled={Data.benefitStatus !== "existing"} // ปิดการกรอกถ้าไม่ใช่ตัวเลือกนี้
                                            />
                                        </label>
                                    </div>


                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="goverment"
                                            name="benefitStatus" // ใช้ name เดียวกันสำหรับ radio ทั้งหมด
                                            value="goverment"
                                            checked={Data.benefitStatus === "goverment"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="goverment" className="block text-gray-700">
                                            สิทธิสวัสดิการข้าราชการ
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="social"
                                            name="benefitStatus" // ใช้ name เดียวกันสำหรับ radio ทั้งหมด
                                            value="social"
                                            checked={Data.benefitStatus === "social"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="social" className="block text-gray-700">
                                            สิทธิประกันสังคม
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="other"
                                            name="benefitStatus" // ใช้ name เดียวกันสำหรับ radio ทั้งหมด
                                            value="other"
                                            checked={Data.benefitStatus === "other"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="other" className="block text-gray-700">
                                            อื่นๆ ระบุ
                                            <input
                                                type="text"
                                                name="otherStatus"
                                                onChange={handleChange}
                                                className="border rounded-lg px-2 py-1 ml-2"
                                                placeholder="โปรดระบุ"
                                                value={Data.otherStatus}
                                                disabled={Data.benefitStatus !== "other"} // ปิดการกรอกถ้าไม่ใช่ตัวเลือกนี้
                                            />
                                        </label>
                                    </div>
                                </div>


                                <h3 className="text-lg font-semibold mb-4 pt-10 ">
                                    หลักฐานที่ยื่นมากับแบบคำขอลงทะเบียน (Identification document)
                                </h3>

                                <div className="flex space-x-4 w-full pt-2 ">
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="CiticenidforDoc"
                                            name="CiticenidforDoc"
                                            value="true"
                                            onChange={handleChange}
                                            checked={Data.CiticenidforDoc === "true"}
                                        />
                                        <label htmlFor="CiticenidforDoc" className="block text-gray-700">
                                            สำเนาบัตรประชาชนพร้อมเซ็นรับรองสำเนา
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="house"
                                            name="house"
                                            value="true"
                                            onChange={handleChange}
                                            checked={Data.house === "true"}
                                        />
                                        <label htmlFor="house" className="block text-gray-700">
                                            สำเนาทะเบียนที่ผู้ขอมีชื่ออยู่
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="Studentcard"
                                            name="Studentcard"
                                            value="true"
                                            onChange={handleChange}
                                            checked={Data.Studentcard === "true"}
                                        />
                                        <label htmlFor="Studentcard" className="block text-gray-700">
                                            สำเนาบัตรประจำตัวนิสิต
                                        </label>
                                    </div>
                                </div>


                                <div className="pt-10"><label className="text-lg font-semibold text-black pt-10">ท่านมีแนวโน้มที่จะใช้บริการ รพ.จุฬาลงกรณ์</label></div>
                                <div className="flex space-x-4 w-full pt-4">
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            id="hospitaluse"
                                            name="hospitalService"
                                            value="1"
                                            checked={Data.hospitalService === '1'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitaluse" className="block text-gray-700">
                                            ใช้
                                        </label>

                                    </div>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            id="hospitalnotuse"
                                            name="hospitalService"
                                            value="2"
                                            checked={Data.hospitalService === '2'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitalnotuse" className="block text-gray-700">
                                            ไม่ใช้
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            name="hospitalService"
                                            value="3"
                                            id="hospitalnotsure"
                                            checked={Data.hospitalService === '3'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitalnotsure" className="block text-gray-700">
                                            ไม่แน่ใจ
                                        </label>
                                    </div>
                                </div>



                                <div className="pt-10"><label className="text-lg font-semibold text-black" >ท่านเคยใช้บริการที่ รพ.จุฬาลงกรณ์</label></div>
                                <div>
                                    <div className="flex space-x-4 w-full pt-4">
                                        <div className="flex items-center space-x-4 w-1/3">
                                            <input
                                                type="radio"
                                                id="usedHospitalBefore"
                                                name="usedHospitalBefore"
                                                value={true} // Boolean value
                                                checked={isTrueSet(Data.usedHospitalBefore) === true} // Compare with Boolean
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="usedHospitalBefore" className="block text-gray-700">
                                                เคย
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-4 w-1/3">
                                            <input
                                                type="radio"
                                                id="notusedHospitalBefore"
                                                name="usedHospitalBefore"
                                                value={false} // Boolean value
                                                checked={isTrueSet(Data.usedHospitalBefore) === false} // Compare with Boolean
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="notusedHospitalBefore" className="block text-gray-700">
                                                ไม่เคย
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <div className="pt-10"><label className="text-lg font-semibold text-black" > ท่านมีโรคประจำตัวหรือไม่</label></div>
                                <div>
                                    <div className="flex space-x-4 w-full pt-4">
                                        <div className="flex items-center space-x-4 w-1/3" >

                                            <input
                                                type="radio"
                                                name="hasChronicDisease"
                                                id="hasChronicDisease"
                                                value={true}
                                                checked={isTrueSet(Data.hasChronicDisease) === true}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="hasChronicDisease" className="block text-gray-700">
                                                มี
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-4 w-1/3" >
                                            <input
                                                type="radio"
                                                name="hasChronicDisease"
                                                id="nothasChronicDisease"
                                                value={false}
                                                checked={isTrueSet(Data.hasChronicDisease) === false}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="nothasChronicDisease" className="block text-gray-700">
                                                ไม่มี
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex justify-between mt-8">
                                    <a href="/home">
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                        >
                                            Back
                                        </button>
                                    </a>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                    >
                                        Next
                                        <ToastContainer />
                                    </button>
                                </div>


                            </form>
                        </section>
                    </div>
                </main>
            </div >
        </div >

    )
}

export default page