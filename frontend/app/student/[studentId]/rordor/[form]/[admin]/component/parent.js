'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormData } from '../../../../../../contexts/RDDataContext';

export const Parent = () => {
    const { formData, updateFormData } = useFormData();
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ ...formData, [name]: value });
    };
    return <>
        <div>
            <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                ข้อมูลมารดา (Mother's information)
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-4 w-full">
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">คำนำหน้าชื่อ (Title)</label>
                    <input
                        type="text"
                        name="mothertitle"
                        value={formData.mothertitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="mother's title"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">ชื่อมารดา (mother's name)</label>
                    <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="mother's name"
                    />
                </div>
            </div>
            <div className="flex space-x-4 w-full ">
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">นามสกุลมารดา (mother's surname)</label>
                    <input
                        type="text"
                        name="motherSurname"
                        value={formData.motherSurname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="mother's surname"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                    <input
                        type="text"
                        name="motherphone"
                        value={formData.motherphone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Mobile number"
                    />
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                ข้อมูลบิดา (Father's information)
            </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-4 w-full">
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">คำนำหน้าชื่อ (Title)</label>
                    <input
                        type="text"
                        name="fathertitle"
                        value={formData.fathertitle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Father's title"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's name)</label>
                    <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Father's name"
                    />
                </div>
            </div>
            <div className="flex space-x-4 w-full ">

                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">นามสกุลบิดา (Father's surname)</label>
                    <input
                        type="text"
                        name="fatherSurname"
                        value={formData.fatherSurname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Father's surname"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                    <input
                        type="text"
                        name="fatherphone"
                        value={formData.fatherphone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Mobile number"
                    />
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">ข้อมูลผู้ปกครอง (Guardian's information)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex space-x-4 w-full ">
                <div className="w-1/2 ">
                    <div className="flex space-x-4 w-full ">
                        <div className="w-1/2">
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
                        <div className='w-1/2'>
                            <label className="block text-gray-700 mb-2">คำนำหน้าชื่อ (Title)</label>
                            <input
                                type="text"
                                name="Parenttitle"
                                value={formData.Parenttitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Parent title"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/2 ">
                    <label className="block text-gray-700 mb-2">ชื่อ (Parent's name)</label>
                    <input
                        type="text"
                        name="ParentName"
                        value={formData.ParentName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Parent Name"
                    />
                </div>
            </div>
            <div className="flex space-x-4 w-full ">
                <div className='w-1/2'>
                    <label className="block text-gray-700 mb-2">นามสกุล (Parent's surname)</label>
                    <input
                        type="text"
                        name="ParentSurname"
                        value={formData.ParentSurname}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Parent Surname"
                    />
                </div>
                <div className='w-1/2'>
                    <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                    <input
                        type="text"
                        name="ParentPhone"
                        value={formData.ParentPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Mobile number"
                    />
                </div>
            </div>
        </div>
    </>
}