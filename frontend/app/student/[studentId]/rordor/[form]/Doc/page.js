"use client"
import { ToastContainer, toast } from 'react-toastify';
import { useFormData } from '../../../../../contexts/RDDataContext'; // Adjust the import path as necessary
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../../../../../components/Header';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';



const RD = () => {
    const { formData, updateFormData } = useFormData();
    const { form } = useParams()
    const { studentId } = useParams()
    const int_form = parseInt(form)
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [isDownload, setIsDownload] = useState(false);
    const [loading, setLoading] = useState(true);



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

    const filepdf = async () => {
        try {
            const response = await axios.get(`/api/export/RD1?id=${int_form}`, { responseType: 'blob' });
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
            link.download = `${profileData.id}_รด1.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsDownload(true);

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
    // const handleNavigation = (event, targetUrl) => {
    //     if (!allChecked()) {
    //         event.preventDefault();
    //         notifyerror()
    //     } else {
    //         window.location.href = targetUrl;
    //     }
    // };
    const handleAllCheck = () => {

        const newState = Object.values(checkboxes).some(value => !value);
        setCheckboxes(Object.keys(checkboxes).reduce((acc, key) => {
            acc[key] = newState;
            return acc;
        }, {}));
    };
    const handleBack = () => {
        console.log("Doc", int_form);

        router.push(`/student/${studentId}/rordor/${int_form}/0/checkData`)
    }
    console.log("studentIDJaaa ", profileData?.id);
    const handleNavigation = async (event) => {
        console.log("formmm", int_form);

        const response = await axios.post(`/api/request/create`, { type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร", status: "รอจองคิว", stuId: profileData.id, formId: int_form });
        const param = response.data.data.id;
        console.log("responseRequest", response.data);
        console.log("param", param);

        if (!allChecked()) {
            event.preventDefault();
            alert("กรุณาทำเครื่องหมายในช่องทั้งหมดก่อนดำเนินการต่อ (Please check all the boxes before proceeding)");
        } else {
            router.push(`/student/${studentId}/appointment/${param}/0`);
        }
    };


    return (
        <div>
            <Header req1="การสมัครเป็น นศท. ปี 1 (ผู้ไม่เคยศึกษาวิชาทหาร) " req2="" />
            <div className="min-h-screen bg-white">
                <main className="flex justify-center items-center">
                    <div className="bg-white p-8 w-full max-w-4xl">


                        <h2 className="text-mb pt-4 font-bold text-center mb-4 text-gray-800">
                            Download เอกสาร และโปรดเตรียมเอกสารดังนี้ (Please prepare the following documents to submit to the staff)
                        </h2>

                        <section>

                            <div className="grid grid-cols-1 gap-6">
                                <fieldset>
                                    <legend className="sr-only">Checkboxes</legend>

                                    <div className="divide-y divide-gray-200">
                                        <div className="items-center py-4">
                                            <div className="font-medium text-gray-900 pr-4">1. Download เอกสารได้ที่นี่ </div>
                                            <button
                                                onClick={handleDownload}
                                                className="mt-3 ml-3 px-3 py-2 bg-green-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-green-400 transition duration-300 w-32">
                                                Download
                                            </button>
                                        </div>

                                        <label
                                            htmlFor="Option1"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >
                                            <div>
                                                <strong className="font-medium text-gray-900 ">2. ติดรูป ชุดนิสิต ขนาด 1.5 นิ้ว</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option2"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">3. สำเนาหลักฐานผลการศึกษาชั้น ม.6</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option3"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >
                                            <div>
                                                <strong className="font-medium text-gray-900">
                                                    4. ใบรับรองแพทย์ โดยแพทย์ปริญญา (ใบรับรองแพทย์มีอายุ 1 เดือนนับจากวันที่ตรวจร่างกาย)
                                                </strong>
                                                <br />
                                                <a
                                                    href="/ใบรับรองแพทย์.pdf"  // 📝 ใส่ path ของไฟล์
                                                    target="_blank"  // 🔗 เปิดในแท็บใหม่
                                                    rel="noopener noreferrer"
                                                    className="text-red-500 hover:underline"
                                                >
                                                    ดูตัวอย่างใบรับรองแพทย์
                                                </a>
                                            </div>
                                        </label>


                                        <label
                                            htmlFor="Option4"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >
                                            <div>
                                                <strong className="font-medium text-gray-900">5. สำเนาใบสำคัญทหารกองเกิน (สด.9) กรณีเป็นผู้สมัครชายอายุ 17 ปีขึ้นไป (ถ้ามี)</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option5"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">6. สำเนาหมายเรียกเข้ารับราชการทหาร (สด.35) กรณีเป็นผู้สมัครชายอายุ 20 ปีขึ้นไป (ถ้ามี)</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option6"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">7. สำเนาใบรับรองผลการตรวจเลือกเข้ารับราชการทหาร (สด.43) กรณีผู้สมัครชายอายุ 21 ปีขึ้นไป (ถ้ามี)</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option7"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">8. สำเนาบัตรประจำตัวประชาชน (copy of citizen ID)</strong>
                                            </div>
                                        </label>

                                        <label
                                            htmlFor="Option8"
                                            className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                                        >


                                            <div>
                                                <strong className="font-medium text-gray-900">9. สำเนาใบเปลี่ยนชื่อ-สกุล (ถ้ามี)</strong>
                                            </div>
                                        </label>
                                    </div>
                                </fieldset>
                                {/* <button
                                    onClick={handleDownload}
                                    className="px-3 py-2 bg-green-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-green-400 transition duration-300 w-32">
                                    Download
                                </button> */}
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
                                            <strong className="font-medium text-gray-900">จัดเตรียมเอกสารตามข้อมูลข้างต้น (Prepare the documents as per the information above)</strong>
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
        </div>
    );
};

export default RD;