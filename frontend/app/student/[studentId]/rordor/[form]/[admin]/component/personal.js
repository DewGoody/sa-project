'use client';
import React, { useState, useEffect } from 'react';
import { useFormData } from '../../../../../../contexts/RDDataContext';
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import { format } from "date-fns";
export const Personal = () => {
    const { formData, updateFormData } = useFormData();
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    }
    return <>
        <h3 className="text-lg font-semibold mb-4 pt-10 pb-2">
            ข้อมูลส่วนตัวและภูมิลำเนา (Personal & contact information)
        </h3>
        <div div className="grid grid-cols-1 md:grid-cols-2 gap-4 " >
            <div className="flex space-x-4 w-full  ">
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">คำนำหน้าชื่อ (Title)</label>
                    <input
                        type="text"
                        name="Nametitle"
                        value={formData.Nametitle}
                        // disabled
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-100 text-gray-500 focus:ring-blue-600"
                        placeholder="Title"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        disabled
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-100 text-gray-500 focus:ring-blue-600"
                        placeholder="Name-Surname"
                    />
                </div>

            </div>
            <div className="flex space-x-4 w-full  ">

                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2 ">สกุล (Surname)</label>
                    <input
                        type="text"
                        name="Surname"
                        value={formData.Surname}
                        disabled
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600 bg-gray-100 text-gray-500"
                        placeholder="Surname"
                    />
                </div>
                <div className='w-1/2'>
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


            </div>
            <div className="flex space-x-4 w-full  ">
                <div className="w-1/2">
                    <div className="flex space-x-4 w-full  ">
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2">วันเกิด (Date of birth)</label>
                            <DatePicker

                                allowClear={false}
                                format="DD/MM/YYYY"
                                value={formData.birthDate ? dayjs(formData.birthDate, "YYYY-MM-DD") : null}
                                onChange={(date) => {
                                    handleChange({
                                        target: {
                                            name: "birthDate",
                                            value: format(date, "yyyy-MM-dd"),
                                        },
                                    });
                                }}
                                disabled={true}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-2">อายุ (Age)</label>
                            <input
                                type="text"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-500"
                                placeholder="Age"
                                disabled

                            />
                        </div>
                    </div>
                </div>
                <div className='w-1/2'>
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
            </div>


            <div className='flex space-x-4 w-full'>
                <div className='w-1/2'>
                    <label className="block text-gray-700 mb-2">ปัจจุบันกำลังศึกษาระดับ (Degree)</label>
                    <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Degree"
                    />
                </div>
                <div className='w-1/2'>
                    <label className="block text-gray-700 mb-2 ">ชั้นปี (Academic year)</label>
                    <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600 bg-gray-100 text-gray-500"
                        placeholder="Academic year"
                        disabled
                    />
                </div>
            </div>
        </div>
    </>
}