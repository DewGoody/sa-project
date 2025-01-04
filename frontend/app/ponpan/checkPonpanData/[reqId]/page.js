"use client"
import React, { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../../../components/header/page';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter,useParams } from 'next/navigation';


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
    
    const handleDownload = () => {
        // const link = document.createElement('a');
        // link.href = '../../documents/accident/prakanformfilled.pdf';
        // link.download = 'prakan.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      };

    const handleBack = () => {  
        router.push(`/ponpan/${reqId}`);
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
        await axios.post(`/api/request/changeStatusToWaitService`, {req_id:reqId});
        
        if (!allChecked()) {
            event.preventDefault();
            alert("กรุณาทำเครื่องหมายในช่องทั้งหมดก่อนดำเนินการต่อ (Please check all the boxes before proceeding)");
        } else {
            router.push(`/appointment/${reqId}/0`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header/>
            <main className="flex justify-center items-center">
                <div className="bg-white p-8 w-full max-w-4xl">
                    {/* Personal & Contact Information Section */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            นิสิตโปรดเตรียมเอกสารดังนี้มายื่นให้เจ้าหน้าที่ 
                        </h3>
                        <h3 className="text-lg font-normal mb-4 text-center">
                        Students, please prepare the following documents to submit to the staff 
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                                <fieldset>
                                    <legend className="sr-only">Checkboxes</legend>

                                    <div className="divide-y divide-gray-200">
                                        <label
                                            htmlFor="Option1"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >
                                            <div>
                                                <strong className="font-medium text-gray-900 ">1. ใบรับรองแพทย์ฉบับจริง</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option2"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">2. ใบรับรองเสร็จฉบับจริง</strong>
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
                            
                                <button 
                                    className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                    onClick={handleBack}
                                    >
                                Back
                                </button>
                            

                            <button
                                onClick={handleDownload}
                                className="px-6 py-3 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300">
                                Download
                            </button>

                            <a
                                onClick={(event) => handleNavigation(event)}
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
    );
};

export default RD;