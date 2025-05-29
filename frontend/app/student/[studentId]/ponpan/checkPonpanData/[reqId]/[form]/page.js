"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Header } from '../../../../../../components/Header.js';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { QuestionOutlined } from '@ant-design/icons';
import { Color } from 'antd/es/color-picker/index.js';


const RD = () => {
    // State to manage checkbox status
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
    const router = useRouter();
    const { reqId } = useParams();
    const {form} = useParams();
    console.log("form :", form);
    const { studentId } = useParams();
    console.log("reqId :", reqId);


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


    const handleBack = () => {
        router.push(`/student/${studentId}/ponpan/${form}`);
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
        await axios.post(`/api/request/changeStatusToWaitBook`, { req_id: reqId });


        router.push(`/student/${studentId}/appointment/${reqId}/0`);

    };

    return (
        <div className="min-h-screen bg-white">
            <Header req1="การขอผ่อนผันการเข้ารับราชการทหาร" req2="Request for deferral of military service" />
            <main className="flex justify-center items-center">
                <div className="bg-white p-8 w-full max-w-4xl">
                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            โปรดเตรียมเอกสารดังต่อไปนี้
                        </h3>
                        <h3 className="text-lg font-normal mb-4 text-center">
                            Please prepare the following documents
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <fieldset>
                                <legend className="sr-only">Checkboxes</legend>

                                <div className="divide-y divide-gray-200">
                                    <label
                                        htmlFor="Option1"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >
                                        <div className='flex justify-around'>
                                            <strong className="font-medium text-gray-900 ">1. สำเนา สด.9 (Copy of certificate of Sor dor 9)</strong>

                                        </div>
                                    </label>

                                    <label
                                        htmlFor="Option2"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">2. สำเนาหมายเรียก สด.35 (Copy of certificate of Sor dor 35)</strong>
                                        </div>
                                    </label>
                                    <label
                                        htmlFor="Option3"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">3. สำเนาบัตรประจำตัวประชาชน (Copy of ID card)</strong>
                                        </div>
                                    </label>
                                    <label
                                        htmlFor="Option3"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">4. สำเนาทะเบียนบ้าน (Copy of residential address)</strong>
                                        </div>
                                    </label>
                                    <label
                                        htmlFor="Option3"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">5. สำเนาบัตรประจำตัวนิสิต (Copy of student ID card)</strong>
                                        </div>
                                    </label>
                                    <label
                                        htmlFor="Option3"
                                        className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                    >


                                        <div>
                                            <strong className="font-medium text-gray-900">6. สำเนารับรองสถานภาพนิสิต (Copy of certificate of student status)</strong>
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
                                        <strong className="font-medium text-gray-900">จัดเตรียมเอกสารตามข้อมูลข้างต้น (Prepare the  above documents)</strong>
                                    </div>
                                </label>



                            </div>
                        </div>
                    </section>

                    {Object.values(checkboxes).filter(Boolean).length >= 1 && (
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
