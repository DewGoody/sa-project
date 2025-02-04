"use client";

import React ,{ useState, useEffect }from "react";
import { Header } from "../../components/Header";
import { useParams, useRouter } from "next/navigation";
import { useFormData } from '../../contexts/RDDataContext'; // Adjust the import path as necessary

const RD = () => {
    const { updateDataid } = useFormData()
    const router = useRouter();
    const { form } = useParams()
    const int_form = parseInt(form)
    useEffect(() => {
        if (form) {
            console.log("เลขform",int_form)
            updateDataid({ int_form })
        }
    }, [form, updateDataid])
    return (
        <div className="min-h-screen bg-white">
            <Header
                req1="การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร"
                req2="Request for deferral of military service"
            />
            <main className="flex justify-center items-center">
                <div className="bg-white p-8 w-full max-w-4xl">
                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            เลือกชั้นปี (Choose Year)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex justify-center">
                                <button
                                    onClick={() =>
                                        router.push(`/rordor/${parseInt(form)}/0/checkData`)
                                    }
                                    className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                >
                                    การสมัครเป็น นศท. ปี 1 (ผู้ไม่เคยศึกษาวิชาทหาร)
                                    <br />
                                    (Application for first-year territorial defense student (never studied military science))
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() =>
                                        router.push(`/rordor/${parseInt(form)}/0/checkData2`)
                                    }
                                    className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                >
                                    การรายงานตัว นศท. ปี 2 เป็นต้นไป
                                    <br />
                                    (Enrollment for territorial defense students year 2 and beyond)
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <a href="/home">
                            <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                Back
                            </button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RD;
