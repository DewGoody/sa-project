'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormData } from '../../../../../../contexts/RDDataContext';

export const Personal = () => {
    const { formData, updateFormData } = useFormData();
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });

        if (name === "province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresById(id);
        } else if (name === "amphure") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsById(id);
        }
    }
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
        fetchProvinces()
    }, [])
    return <>
        <h3 className="text-lg font-semibold mb-4 ">
            ข้อมูลส่วนตัวและภูมิลำเนา (Personal & contact information)
        </h3>
        <div div className="grid grid-cols-1 md:grid-cols-2 gap-4 " >
            <div className="flex space-x-4 w-full  ">
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        disabled
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Name-Surname"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2 ">สกุล (Surname)</label>
                    <input
                        type="text"
                        name="Surname"
                        value={formData.Surname}
                        disabled
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                        placeholder="Surname"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2">อายุ (Age)</label>
                <input
                    type="text"
                    name="OldRD"
                    value={formData.OldRD}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Old"
                />
            </div>


            <div>
                <label className="block text-gray-700 mb-2">เลขประจำตัว นศท (Reserve officer training corps student ID)</label>
                <input
                    type="text"
                    name="citizenRD"
                    value={formData.citizenRD}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Reserve officer training corps student ID"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">เลขประจำตัวประชาชน (Identification number)</label>
                <input
                    type="text"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Identification number"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">อีเมล (Email)</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Email"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">โทรศัพท์มือถือ (Mobile number)</label>
                <input
                    type="text"
                    name="phone_num"
                    value={formData.phone_num}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Mobile number"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">โทรศัพท์ (Phone number)</label>
                <input
                    type="text"
                    name="tel_num"
                    value={formData.tel_num}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Phone number"
                />
            </div>
        </div>
        {/* {check} */}
        <div>
            <h3 className="text-lg font-semibold mb-4 py-10 ">
                ประวัติการศึกษาวิชาทหาร (Reserve officer traning record)
            </h3>
        </div>
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">สถานศึกษาปัจจุบัน (Current institution)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="จุฬาลงกรณ์มหาวิทยาลัย"
                        disabled="true"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="กรุงเทพมหานคร"
                        disabled="true"
                    />
                </div>
                <div className="flex space-x-4 w-full">
                    <div className="w-full">
                        <label className="block text-gray-700 mb-2">ชั้นปี (College year)</label>
                        <input
                            type="text"
                            name="Collage_Year"
                            value={formData.Collage_Year}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Collage Year"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-gray-700 mb-2">แผนก/คณะ (Faculty)</label>
                        <input
                            type="text"
                            name="Major"
                            value={formData.Major}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Faculty"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">วันที่เข้าศึกษา (Entry date)</label>
                    <input
                        type="date"
                        name="Fristdata_in_U"
                        value={formData.Fristdata_in_U}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Date"
                    />
                </div>
            </div>
            <div>
                <h3 className="grid text-lg font-semibold mb-4  pt-8 pl-3">
                    ได้สำเร็จการศีกษาวิชาทหารจาก (Military training record)
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                <div >
                    <label className="block text-gray-700 mb-2">สถานศึกษา (Institution)</label>
                    <input
                        type="text"
                        name="Whereform"
                        value={formData.Whereform}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="From the military education institution"
                    />

                </div>
                <div >
                    <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                    <select
                        name="militaryProvince2"
                        value={formData.militaryProvince2}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value={formData.militaryProvince2}>{formData.militaryProvince2}</option>
                        {provinces.map((item, index) => (
                            <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                        ))}
                    </select>
                </div>


                <div className="flex space-x-4 w-full  ">
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">ชั้นปี (level)</label>
                        <select
                            name="BeforeMilitartYear"
                            value={formData.BeforeMilitartYear}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="" disabled>Select year level</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">ปีการศึกษา (Academic year)</label>
                        <input
                            type="text"
                            name="YearBefore"
                            value={formData.YearBefore}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Academic year"
                        />
                    </div>

                </div>

            </div>

            <div>
                <h3 className="grid content-center text-lg font-semibold mb-4 pt-8 pl-3 ">
                    ขอรายงานตัวเข้าฝึกวิชาทหาร (Requeue for military traning)
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">

                <div className="flex space-x-4 w-full  ">
                    <div className="w-1/2 ">
                        <label className="block text-gray-700 mb-2">ชั้นปี (Year level)</label>
                        <select
                            name="YearGradeRD"
                            value={formData.YearGradeRD}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="" disabled>Select year level</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div className="w-1/2 " >
                        <label className="block text-gray-700 mb-2">ประจำปีการศึกษา (Academic year)</label>
                        <input
                            type="text"
                            name="Yearregister"
                            value={formData.Yearregister}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Domicile Number"
                            disabled
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">ประเภทรายงานตัว (Type of requeue)</label>
                    <select
                        name="register_type"
                        value={formData.register_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="" disabled>Select type of reporting</option>
                        <option value="1">เลื่อนชั้น (Promotion)</option>
                        <option value="2">ซ้ำชั้น (Repeat)</option>
                        <option value="3">รอรับสิทธิ (Postporement)</option>
                        <option value="4">โอนย้ายสถานศึกษาวิชาทหาร (Transfer)</option>
                    </select>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 py-10 ">
                    ที่อยู่ปัจจุบัน (Current address)
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">เลขที่บ้าน (Address number)</label>
                    <input
                        type="text"
                        name="domicileNumber"
                        value={formData.domicileNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Address Number"
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
                    <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                    <input
                        type="text"
                        name="moo"
                        value={formData.moo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Moo"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">ตรอย/ซอย (Soi)</label>
                    <input
                        type="text"
                        name="soi"
                        value={formData.soi}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Soi"
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
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Subdistrict"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Zip code"
                    />
                </div>
            </div>
        </div >
    </>
}