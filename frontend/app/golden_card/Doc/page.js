"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../../components/Header';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;



const gold = () => {

    const filepdf = async () => {
        try {
            const response = await axios.get("/api/export/UHC_Reg", { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };


    const [selectedFiles, setSelectedFiles] = useState([]); // เริ่มต้นเป็น Array

    

    const handleFileChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            const fileList = info.fileList.map(file => file.originFileObj); // ดึงไฟล์ออกมาเป็น Array
            setSelectedFiles(fileList); // เก็บไฟล์ลง state
        } else if (status === 'error') {
            setSelectedFiles([]); // ล้าง state เมื่อเกิดข้อผิดพลาด
        }
    };
    

    const handleConfirm = async (event) => {
        event.preventDefault();
    
        if (!allChecked()) {
            notifyerror();
            return;
        }
    
        if (!selectedFiles || selectedFiles.length === 0) { // ตรวจสอบไฟล์
            toast.error("กรุณาเลือกไฟล์ก่อนทำการอัปโหลด");
            return;
        }
    
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append("file", file); // เพิ่มไฟล์ลงใน FormData
        });
    
        try {
            const response = await axios.post(
                `/api/POSTPDF`, // เรียก API endpoint
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            // console.log(response.data);
            window.location.href = "/home";
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("การอัปโหลดล้มเหลว");
        }
    };
    

    const props = {
        name: 'file',
        multiple: true, // อนุญาตให้อัปโหลดหลายไฟล์
        onChange(info) {
            handleFileChange(info); // ใช้ฟังก์ชันใหม่ที่แก้ไขแล้ว
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                console.log(info);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    




    const handleDownload = async () => {
        const pdfBlob = await filepdf();
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'file.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };



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
                            นิสิตโหลดและอัพโหลดเอกสารที่นี่
                        </h2>
                        <h1 className="text-mb text-gray-700 mb-6 text-center">
                            Students can download and upload documents here.
                        </h1>

                        {/* Personal & Contact Information Section */}
                        <section>

                            <div className="grid grid-cols-1 gap-6">
                                <fieldset>
                                    <div>
                                        <Dragger {...props}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">
                                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                                banned files.
                                            </p>
                                        </Dragger>
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
                                            <strong className="font-medium text-gray-900">เซ็นเอกสารแล้ว</strong>
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
                                            <strong className="font-medium text-gray-900">ดาวน์โหลดไฟล์และอัพโหลดไฟล์แล้ว</strong>
                                        </div>
                                    </label>
                                </div>
                            </div>


                        </section>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <a
                                href="/golden_card"

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
                                onClick={handleConfirm}>
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

export default gold;