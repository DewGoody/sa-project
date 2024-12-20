"use client"
import { ToastContainer, toast } from 'react-toastify';
import { useFormData } from '../../contexts/RDDataContext'; // Adjust the import path as necessary
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../../components/Header';
import axios from 'axios';
import React, { useState, useEffect } from 'react';




const RD = () => {
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const filepdf = async () => {
        try {
            const response = await axios.get("/api/export/RD2", { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownload = async () => {
        const pdfBlob = await filepdf();
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'RD2.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // const handleDownload = () => {
    //     const link = document.createElement('a');
    //     link.href = '/test.pdf';
    //     link.download = 'sample.pdf';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const [checkboxes, setCheckboxes] = useState({
        Option1: false,
        Option2: false,
        Option3: false,
        Option4: false,
        Option5: false,
        Option6: false,
        Option7: false,
        Option8: false,
        Option9: false,
    });

    // Function to handle checkbox change
    const handleCheckboxChange = (event) => {
        setCheckboxes({
            ...checkboxes,
            [event.target.id]: event.target.checked,
        });
    };

    // Function to check if all checkboxes are checked
    const allChecked = () => {
        return Object.values(checkboxes).every((isChecked) => isChecked);
    };
    const notifyerror = () => {
        toast.error('👆🏻 ติ๊กให้ครบทุกช่อง', {
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
    // Function to handle navigation attempt
    const handleNavigation = (event, targetUrl) => {
        if (!allChecked()) {
            event.preventDefault();
            notifyerror()
        } else {
            window.location.href = targetUrl;
        }
    };
    const handleAllCheck = () => {
        const newState = Object.values(checkboxes).some(value => !value);
        setCheckboxes(Object.keys(checkboxes).reduce((acc, key) => {
            acc[key] = newState;
            return acc;
        }, {}));
    };


    return (
        <div>
            <Header req1="รายงานตัวเข้าฝึกนักศึกษาวิชาทหาร " req2="" />
            <div className="min-h-screen bg-white">
                <main className="flex justify-center items-center">
                    <div className="bg-white p-8 w-full max-w-4xl">
                        <h2 className="text-lg font-bold text-center mb-4 text-gray-800">
                            นิสิตโปรดเตรียมเอกสารดังนี้มายื่นให้เจ้าหน้าที่
                        </h2>
                        <h1 className="text-mb text-gray-700 mb-6 text-center">
                            Students, please prepare the following documents to submit to the staff
                        </h1>

                        {/* Personal & Contact Information Section */}
                        <section>

                            <div className="grid grid-cols-1 gap-6">
                                <fieldset>
                                    <legend className="sr-only">Checkboxes</legend>

                                    <div className="divide-y divide-gray-200">
                                        <label
                                            htmlFor="Option1"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >
                                            <div>
                                                <strong className="font-medium text-gray-900 ">1. ติดรูป ชุดนักศึกษาวิชาทหาร ขนาด 1.5 นิ้ว</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option2"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">2. สำเนาบัตรนักศึกษาวิชาทหาร</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option3"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">3. ใบสำเร็จนักศึกษาวิชาทหารล่าสุด (กรณีโอนย้าย)</strong>
                                            </div>
                                        </label>
                                    </div>



                                </fieldset>
                                <div className="flex space-x-4">
                                    <label
                                        htmlFor="Option9"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div className="flex items-center">
                                            &#8203;
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-gray-300"
                                                id="Option9"
                                                checked={checkboxes.Option9}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>

                                        <div>
                                            <strong className="font-medium text-gray-900">รับทราบรายการเอกสาร</strong>
                                        </div>
                                    </label>


                                    <label

                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div className="flex items-center">
                                            &#8203;
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-gray-300"
                                                id="allCheck"
                                                checked={allChecked()}
                                                onChange={handleAllCheck}
                                            />
                                        </div>

                                        <div>
                                            <strong className="font-medium text-gray-900">ดาวน์โหลดไฟล์และตรวจสอบข้อมูลแล้ว</strong>
                                        </div>
                                    </label>
                                </div>
                            </div>


                        </section>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <a
                                href="/rordor/checkData2"

                            >
                                <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                    Back
                                </button>
                            </a>

                            <button
                                onClick={handleDownload}
                                className="px-6 py-3 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300">
                                Download
                            </button>

                            <a
                                href="/home"
                                onClick={(event) => handleNavigation(event, "/home")}
                            >
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                >
                                    Confrim
                                    <ToastContainer />
                                </button>
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RD;