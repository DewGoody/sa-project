"use client"
import React, { useState } from 'react';

const RD = () => {
    return (
        <div className="min-h-screen bg-white">
            <main className="flex justify-center items-center">
                <div className="bg-white p-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold text-center mb-4 text-pink-400">
                        การรับสมัครและรายงานตัวนักศึกษาวิชาทหารสำหรับผู้สมัครใหม่
                    </h2>
                    <h1 className="text-xl text-gray-700 mb-6 text-center">
                        Recruitment and reporting of military students for new applicants
                    </h1>

                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            นิสิตเตรียมเอกสารการสมัครและรายงานตัวดังนี้
                        </h3>
                        <div className="grid grid-cols-1  gap-6">
                            <fieldset>
                                <legend class="sr-only">Checkboxes</legend>

                                <div class="divide-y divide-gray-200">
                                    <label
                                        for="Option1"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option1" require />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900"> ติดรูป </strong>

                                        </div>
                                    </label>

                                    <label
                                        for="Option2"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option2" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                     สำเนาหลักฐานผลการศึกษาชั้น ม.6
                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">

                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option3"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                     ใบรับรองแพทย์ โดยแพทย์ปริญญา (ใบรับรองแพทย์มีอายุ 1 เดือนนับจากวันที่ตรวจร่างกาย)
                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option4"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                     สำเนาใบสำคัญทหารกองเกิน (สด.9) กรณีเป็นผู้สมัครชายอายุ 17 ปีขึ้นไป

                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option5"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900"> สำเนาหมายเรียกเข้ารับราชการทหาร (สด.35) กรณีเป็นผู้สมัครชายอายุ 20 ปีขึ้นไป

                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option6"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                    สำเนาใบรับรองผลการตรวจเลือกเข้ารับราชการทหาร (สด.43) กรณีผู้สมัครชายอายุ 21 ปีขึ้นไป

                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option7"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                      สำเนาบัตรประจำตัวประชาชน

                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        for="Option8"
                                        class="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div class="flex items-center">
                                            &#8203;
                                            <input type="checkbox" class="size-4 rounded border-gray-300" id="Option3" />
                                        </div>

                                        <div>
                                            <strong class="font-medium text-gray-900">                                     สำเนาใบเปลี่ยนชื่อ-สกุล (ถ้ามี)

                                            </strong>

                                            <p class="mt-1 text-pretty text-sm text-gray-700">
                                            </p>
                                        </div>
                                    </label>

                                  
                                </div>
                            </fieldset>
                        </div>

                    </section>


                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/rordor/checkData">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                หน้าก่อนหน้า
                            </button>
                        </a>

                        <button className="px-6 py-3 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300">
                            ดาวน์โหลดฟอร์ม
                        </button>

                        <a href="/home">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                            >
                                หน้าแรก
                            </button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RD;