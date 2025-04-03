"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Header } from '../../../../../../components/Header.js';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';


const RD = () => {
    const { studentId } = useParams();
    const [checkboxes, setCheckboxes] = useState({
        Option1: false,
        Option2: false,
        Option3: false,
    });
    const [createRequest, setCreateRequest] = useState([]);
    const [prakanData, setPrakanData] = useState({});
    const [studentInfo, setStudentInfo] = useState({});

    const [inputValue, setInputValue] = useState('');
    const [thaiText, setThaiText] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownload, setIsDownload] = useState(false);
    const router = useRouter();
    const { reqId } = useParams();
    const { form } = useParams();
    console.log("reqId :", reqId);
    console.log("form :", form);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/profile'); // Example API
                console.log(response.data);

                setProfileData(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownload = async () => {        
        const response = await axios.post('/api/prakan/createPdf', {form: form})
        console.log("responseDownload", response.data);
        setPrakanData(response.data.data)
        const link = document.createElement('a');
        link.href = '../../../../../documents/accident/'+response.data.data.Student.id+'_accident_insurance.pdf';
        link.download = response.data.data.Student.id+'_accident_insurance.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownload(true);
    };

    const handleBack = () => {
        router.push(`/prakan/${form}`);
    };

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
    const handleAllCheck = () => {
        const newState = Object.values(checkboxes).some(value => !value);
        setCheckboxes(Object.keys(checkboxes).reduce((acc, key) => {
            acc[key] = newState;
            return acc;
        }, {}));
    };

    // Function to handle navigation attempt
    const handleNavigation = async (event) => {
        // const response = await axios.post(`/api/request/create`, { type: "การเบิกจ่ายประกันอุบัติเหตุ", status: "รอจองคิว", stuId: profileData.id, formId: form });
        // setCreateRequest(response.data);
        // console.log("createRequest", createRequest);
        // const param = response.data.data.id;
        // console.log("responseRequest", response.data);
        // console.log("param", param);
        await axios.post(`/api/request/changeStatusToWaitBook`, {req_id:reqId});

        if (!allChecked()) {
            event.preventDefault();
            alert("กรุณาทำเครื่องหมายในช่องทั้งหมดก่อนดำเนินการต่อ (Please check all the boxes before proceeding)");
        } else {
            const response2 = await axios.post('/api/prakan/deletePdf', prakanData)
            router.push(`/student/${studentId}/appointment/${reqId}/0`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header req1="การเบิกจ่ายประกันอุบัติเหตุ" req2="Accident insurance claim" />
            <main className="flex justify-center items-center">
                <div className="bg-white p-8 w-full max-w-4xl">
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Download เอกสาร และโปรดเตรียมเอกสารดังนี้
                        </h3>
                        <h3 className="text-lg font-normal mb-4 text-center">
                            Please download and prepare the following documents to submit to the staff
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <fieldset>
                                <legend className="sr-only">Checkboxes</legend>
                                <div className="items-center py-4">
                                    <div className="font-medium text-gray-900 pr-4">1. Download เอกสารได้ที่นี่ </div>
                                    <button
                                        onClick={handleDownload}
                                        className="mt-3 ml-3 px-3 py-2 bg-green-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-green-400 transition duration-300 w-32">
                                        Download
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    <label
                                        htmlFor="Option1"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div>
                                            <strong className="font-medium text-gray-900 ">2. ใบรับรองแพทย์ฉบับจริง (Original medical certificate)</strong>
                                        </div>
                                    </label>

                                    <label
                                        htmlFor="Option2"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">3. ใบเสร็จฉบับจริง (Original receipt)</strong>
                                        </div>
                                    </label>
                                    <label
                                        htmlFor="Option3"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">4. สำเนาบัญชีธนาคาร (Bank account copy)</strong>
                                        </div>
                                    </label>
                                </div>
                            </fieldset>
                            <div className="">
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
                                        <strong className="font-medium text-gray-900">จัดเตรียมเอกสารตามข้อมูลข้างต้น (Prepare the above documents)</strong>
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
                                            disabled={!isDownload}
                                        />
                                    </div>

                                    <div>
                                        <strong className="font-medium text-gray-900">ดาวน์โหลดไฟล์และตรวจสอบข้อมูลแล้ว (Download the file and verify the information)</strong>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {Object.values(checkboxes).filter(Boolean).length >= 2 && (
                        <div className="flex justify-end mt-8">

                            <button
                                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                onClick={handleBack}
                            >
                                Back
                            </button>




                            <a
                                onClick={(event) => handleNavigation(event)}
                            >
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-pink-400 text-white font-semibold ml-3 rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                >
                                    Book queue
                                    <ToastContainer />
                                </button>
                            </a>
                        </div>
                    )}

                </div>

            </main>
        </div>
    );
};

export default RD;
