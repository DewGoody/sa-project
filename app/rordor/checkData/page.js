// pages/rordor/checkData.js
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormData } from '../../contexts/FormDataContext'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';

const CheckData = () => {
    const { formData, updateFormData } = useFormData();
    const router = useRouter();
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provincesmilitary, setProvincesmilitary] = useState([]);
    const [amphuresmilitary, setAmphuresmilitary] = useState([]);
    const [districtsmilitary, setDistrictsmilitary] = useState([]);

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

    const fetchProvincesmilitary = async () => {
        try {
            const response = await axios.get("/api/Province");
            setProvincesmilitary(response.data);
        } catch (err) {
            console.log("Error fetching provinces: " + err);
        }
    };

    const fetchAmphuresByIdmilitary = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresmilitary(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistrictsByIdmilitary = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsmilitary(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };


    useEffect(() => {
        fetchProvinces();
        fetchProvincesmilitary();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });

        if (name === "province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresById(id);
        } else if (name === "amphure") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsById(id);
        } else if (name === "militaryProvince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdmilitary(id);
        } else if (name === "militaryDistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdmilitary(id);
        }
    };
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const id = 6512345678
        try {
            await axios.put(`/api/profile`, {
                title: formData.Nametitle,
                fnameTH: formData.Name,
                lnameTH: formData.Surname,
                thai_id: formData.citizenId,
                bd: formatDateToISO(formData.birthDate),
                religion: formData.religion,
                race: formData.ethnicity,
                nationality: formData.nationality,
            })

            await axios.put(`/api/military`, {
                military_course: {
                    id: id,
                    grade9_gpax: formData.grade9GPAX,
                    grade9_school: formData.school,
                    grade9_province: formData.schoolProvince,
                    father_mother_relationship: formData.Parentrelated,
                },
                DOPA_address: {
                    id: id,
                    address_type: "DOPA_address",
                    district: formData.amphure,
                    province: formData.province,
                    postal_code: parseInt(formData.zipCode),
                    subdistrict: formData.district

                },
                military_address: {
                    id: id,
                    address_type: "Military_address",
                    district: formData.militaryDistrict,
                    province: formData.militaryProvince,
                    subdistrict: formData.militaryAmphure,
                    house_num: formData.militaryDomicileNumber
                },
                parent_info: {
                    id: id,
                    parent_fname: formData.ParentName,
                    parent_lname: formData.ParentSurname,
                    title: formData.Parenttitle,
                    occupation: formData.Parentjob,
                    age: parseInt(formData.Parentage),
                    parent_relation: formData.Parentrelated,
                    parent_address: formData.ParentworkAddress
                },
                father_into: {
                    id: id,

                    relation: "father",
                    fname: formData.fatherName,
                    fname: formData.fatherSurname,
                },
                mother_into: {
                    id: id,

                    relation: "mother",
                    fname: formData.motherName,
                    lname: formData.motherSurname,
                    mf_occupation: formData.occupation
                }

            })
            router.push("/rordor/Doc")
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">
            <main className="flex justify-center items-center ">
                <div className="bg-white p-8 w-full ">
                    <h2 className="text-xl font-bold  mb-4 text-gray-800">
                        การรับนิสิตใหม่และรายงานตัวนักศึกษาวิชาทหาร รด. ชั้นปีที่ ๑ (I) (New Recruit and Reporting Unit-Military Studies, Royal Thai Armed Forces.)
                    </h2>


                    <section className="ml-5">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-lg font-semibold mb-4 ">
                                ข้อมูลส่วนตัวและภูมิลำเนา (Personal & Contact Information)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">


                                <div className="flex space-x-4 w-full  ">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 mb-2">คำนำหน้า (Prefix)</label>
                                        <input
                                            type="text"
                                            name="Nametitle"
                                            value={formData.Nametitle}
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
                                            value={formData.Name}
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
                                        value={formData.Surname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                        placeholder="Surname"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">เลขบัตรประชาชน (Citizen ID)</label>
                                    <input
                                        type="text"
                                        name="citizenId"
                                        value={formData.citizenId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Citizen ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">วันเกิด (Birth Date)</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Birth Date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ศาสนา (Religion)</label>
                                    <input
                                        type="text"
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Religion"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">เชื้อชาติ (Ethnicity)</label>
                                    <input
                                        type="text"
                                        name="ethnicity"
                                        value={formData.ethnicity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Ethnicity"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Nationality"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 py-10">
                                    ข้อมูลผู้ปกครอง (Parent information)
                                </h3>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's Name)</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Father Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">นามสกุลบิดา (Father's Surname)</label>
                                    <input
                                        type="text"
                                        name="fatherSurname"
                                        value={formData.fatherSurname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Father Surname"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ชื่อมารดา (Mother's Name)</label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={formData.motherName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Mother Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">นามสกุลมารดา (Mother's Surname)</label>
                                    <input
                                        type="text"
                                        name="motherSurname"
                                        value={formData.motherSurname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Mother Surname"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">อาชีพ (Occupation)</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Occupation"
                                    />
                                </div>

                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 py-10 ">
                                    ที่อยู่ปัจจุบัน (Current address)
                                </h3>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">เลขที่บ้าน (Domicile Number)</label>
                                    <input
                                        type="text"
                                        name="domicileNumber"
                                        value={formData.domicileNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Domicile Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                                    <input
                                        type="text"
                                        name="road"
                                        value={formData.road}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Road"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                    <select
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.province}>{formData.province}</option>
                                        {provinces.map((item, index) => (
                                            <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                    <select
                                        name="amphure"
                                        value={formData.amphure}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.amphure}>{formData.amphure}</option>
                                        {amphures.map((amphure, index) => (
                                            <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.district}>{formData.district}</option>
                                        {districts.map((district, index) => (
                                            <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip Code)</label>
                                    <select
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.zipCode}>{formData.zipCode}</option>
                                        {districts.map((district, index) => (
                                            <option key={index} value={district.zipCode}>{district.zipCode}</option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 py-10 ">
                                    ภูมิลำเนาทหาร (Military domicile)
                                </h3>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">ภูมิลำเนาทหารเลขที่ (Military Domicile Number)</label>
                                    <input
                                        type="text"
                                        name="militaryDomicileNumber"
                                        value={formData.militaryDomicileNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Military Domicile Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">จังหวัดทหาร (Military Province)</label>
                                    <select
                                        name="militaryProvince"
                                        value={formData.militaryProvince}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.militaryProvince}>{formData.militaryProvince}</option>
                                        {provincesmilitary.map((item, index) => (
                                            <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">อำเภอทหาร (Military District)</label>
                                    <select
                                        name="militaryDistrict"
                                        value={formData.militaryDistrict}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.militaryDistrict}>{formData.militaryDistrict}</option>
                                        {amphuresmilitary.map((amphure, index) => (
                                            <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ตำบลทหาร (Military Amphure)</label>
                                    <select
                                        name="militaryAmphure"
                                        value={formData.militaryAmphure}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.militaryAmphure}>{formData.militaryAmphure}</option>
                                        {districtsmilitary.map((district, index) => (
                                            <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">สำเร็จชั้น ม.๓ คะแนนเฉลี่ย (Grade 9 GPAX)</label>
                                    <input
                                        type="text"
                                        name="grade9GPAX"
                                        value={formData.grade9GPAX}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Grade 9 GPAX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">โรงเรียน (School)</label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="School"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">จังหวัดโรงเรียน (School Province)</label>
                                    <select
                                        name="schoolProvince"
                                        value={formData.schoolProvince}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value={formData.schoolProvince}>{formData.schoolProvince}</option>
                                        {provinces.map((item, index) => (
                                            <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 py-10 ">คำยินยอมจากผู้ปกครอง (Parental consent)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-gray-700 mb-2">คำนำหน้าชื่อผู้ปกครอง (Parent Name Title)</label>
                                    <input
                                        type="text"
                                        name="Parenttitle"
                                        value={formData.Parenttitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ชื่อผู้ปกครอง (Parent Name)</label>
                                    <input
                                        type="text"
                                        name="ParentName"
                                        value={formData.ParentName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">นามสกุลผู้ปกครอง (Parent Surname)</label>
                                    <input
                                        type="text"
                                        name="ParentSurname"
                                        value={formData.ParentSurname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent Surname"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">อายุผู้ปกครอง (Parent Age)</label>
                                    <input
                                        type="text"
                                        name="Parentage"
                                        value={formData.Parentage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent Age"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">อาชีพผู้ปกครอง (Parent Job)</label>
                                    <input
                                        type="text"
                                        name="Parentjob"
                                        value={formData.Parentjob}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent Job"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงานผู้ปกครอง (Parent Work Address)</label>
                                    <input
                                        type="text"
                                        name="ParentworkAddress"
                                        value={formData.ParentworkAddress}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Parent Work Address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">เกี่ยวข้องเป็น (Related)</label>
                                    <input
                                        type="text"
                                        name="Parentrelated"
                                        value={formData.Parentrelated}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        placeholder="Related"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between mt-8">
                                <a href="/rordor">
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                    >
                                        หน้าก่อนหน้า
                                    </button>
                                </a>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                >
                                    หน้าถัดไป
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CheckData;