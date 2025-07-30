'use client';
import React, { useState, useEffect } from 'react';
import { PatternFormat } from "react-number-format";
import axios from 'axios';
import { Header } from '../../../../components/Header';
import { useGoldenContext } from '../../../../contexts/GoldenData';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";
import 'react-toastify/dist/ReactToastify.css';
let errorToastId = null;
let inprocessToastId = null;
let successToastId = null;

export const notifyerror = (param) => {
    if (!toast.isActive(errorToastId)) {
        errorToastId = toast.error(param, {
            toastId: "error-toast",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }
};

export const notifyinprocess = () => {
    if (!toast.isActive(inprocessToastId)) {
        inprocessToastId = toast.info('Inprocess', {
            toastId: "inprocess-toast",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }
};

export const notifysuccess = () => {
    if (!toast.isActive(successToastId)) {
        successToastId = toast.success('Success', {
            toastId: "success-toast",
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    }
};
const page = () => {
    const { form } = useParams()
    const { studentId } = useParams()
    const router = useRouter();
    const { Data, updateData } = useGoldenContext();
    const { updateDataid } = useGoldenContext(); // ใช้ context
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const int_req_id = parseInt(form)
    useEffect(() => {
        if (form) {
            updateDataid({ int_req_id }); // Pass form to the context
        }
    }, [form, updateData]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Name: ${name}, Value: ${value}`);

        updateData({ [name]: value });
        if (name === "province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresById(id);
        } else if (name === "amphure") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsById(id);
        }

        // เคลียร์ค่า hospitalName เมื่อ benefitStatus ไม่ใช่ "existing"
        if (name === "benefitStatus" && value !== "existing") {
            updateData({ hospitalName: '' });
        }
        if (name === "benefitStatus" && value !== "other") {
            updateData({ otherStatus: '' });
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get("/api/Province");

            setProvinces(response.data);
        } catch (err) {
            console.log("Error fetching provinces: " + err);
        }
    };

    const fetchAmphuresById = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphures(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistrictsById = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistricts(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };
    var isTrueSet = (CH) => (String(CH).toLowerCase() === 'true');
    useEffect(() => {
        fetchProvinces();

    }, []);
    useEffect(() => {
        console.log(Data)


    }, [Data]);
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const validateForm = () => {
        const requiredFields = {
            // ----------------- Student -----------------
            Nametitle: "คำนำหน้า (Title)",
            Name: "ชื่อ (Name)",
            Surname: "นามสกุล (Surname)",
            citizenId: "เลขบัตรประชาชน (Identification number)",
            Idcardissuedate: "วันที่ออกบัตรประชาชน (Issue date of ID card)",
            Idcardexpiraiton: "วันหมดอายุบัตรประชาชน (Exp date of Id card )",
            birthDate: "วันเกิด (Date of birth)",
            facultyNameTH: "คณะ (Faculty name)",
            year: "ชั้นปี (Year)",
            Job: "อาชีพ (Occupation)",
            Telnumber: "โทรศัพท์ (Phone number)",
            Phonenumber: "เบอร์มือถือ (Mobile number)",
            Contactphone: "เบอร์ที่ติดต่อได้ (Contactable phone)",
            email: "อีเมล (Email)",

            // ----------------- DOPA_address -----------------
            domicileNumber: "เลขที่บ้าน (Address number)",
            house_moo: "หมู่ (Moo)",
            soi: "ซอย (Soi)",
            road: "ถนน (Road)",
            province: "จังหวัด (Province)",
            amphure: "เขต/อำเภอ (District)",
            district: "แขวง/ตำบล (Subdistrict)",
            zipCode: "รหัสไปรษณีย์ (Zip Code)",

            // ----------------- UHC_reg_info -----------------
            benefitStatus: "สถานะสิทธิ (Benefit status)",
            hospitalService: "แนวโน้มใช้บริการ รพ.จุฬาฯ",
            usedHospitalBefore: "เคยใช้บริการ รพ.จุฬาฯ หรือไม่",
            hasChronicDisease: "มีโรคประจำตัวหรือไม่",
        };

        // ตรวจ field พื้นฐาน
        for (const [key, label] of Object.entries(requiredFields)) {
            const value = Data[key];
            if (
                value === null ||
                value === undefined ||
                value === "" 
            ) {
                notifyerror(`กรุณากรอกข้อมูล: ${label}`);
                return false;
            }
        }

        // ตรวจความยาวเลขบัตรประชาชน
        const cleanedCitizenId = Data.citizenId?.replace(/_/g, '');
        if (!cleanedCitizenId || cleanedCitizenId.length !== 13) {
            notifyerror("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
            return false;
        }
        if (!Data.zipCode || Data.zipCode.replace(/_/g, '').length !== 5) {
            toast.error("กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก");
            return false;
        }

        // ตรวจกรณี benefitStatus เป็น "existing" หรือ "other"
        if (Data.benefitStatus === "existing" && (!Data.hospitalName || Data.hospitalName.trim() === "")) {
            notifyerror("กรุณาระบุชื่อโรงพยาบาลเดิมที่เคยใช้สิทธิ");
            return false;
        }
        if (Data.benefitStatus === "other" && (!Data.otherStatus || Data.otherStatus.trim() === "")) {
            notifyerror("กรุณาระบุสถานะสิทธิอื่น ๆ");
            return false;
        }

        return true;
    };

    // const validateForm = () => {
    //     // รายการฟิลด์ที่ต้องไม่เป็น ""
    //     if (!Data.citizenId || Data.citizenId.replace(/_/g, '').length !== 13) {
    //         toast.error("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
    //         return false;
    //     }

    //     if (!Data.zipCode || Data.zipCode.replace(/_/g, '').length !== 5) {
    //         toast.error("กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก");
    //         return false;
    //     }

    //     if (!Data.Nametitle) {
    //         toast.error("กรุณากรอกคำนำหน้า");
    //         return false;
    //     }

    //     if (!Data.Name) {
    //         toast.error("กรุณากรอกชื่อ");
    //         return false;
    //     }

    //     if (!Data.Surname) {
    //         toast.error("กรุณากรอกนามสกุล");
    //         return false;
    //     }

    //     if (!Data.birthDate) {
    //         toast.error("กรุณากรอกวันเกิด");
    //         return false;
    //     }

    //     if (!Data.Telnumber) {
    //         toast.error("กรุณากรอกเบอร์โทรศัพท์");
    //         return false;
    //     }

    //     if (!Data.Contactphone) {
    //         toast.error("กรุณากรอกเบอร์ที่ติดต่อได้");
    //         return false;
    //     }

    //     if (!Data.province || !Data.amphure || !Data.district) {
    //         toast.error("กรุณากรอกที่อยู่ให้ครบ (จังหวัด/เขต/แขวง)");
    //         return false;
    //     }

    //     if (!Data.domicileNumber) {
    //         toast.error("กรุณากรอกเลขที่บ้าน");
    //         return false;
    //     }

    //     if (!Data.road) {
    //         toast.error("กรุณากรอกถนน");
    //         return false;
    //     }

    //     if (Data.benefitStatus === "existing" && !Data.hospitalName) {
    //         toast.error("กรุณากรอกชื่อโรงพยาบาลที่มีสิทธิ์");
    //         return false;
    //     }

    //     if (Data.benefitStatus === "other" && !Data.otherStatus) {
    //         toast.error("กรุณาระบุสิทธิ์อื่น ๆ");
    //         return false;
    //     }

    //     return true; // ถ้าไม่เจออะไรผิด
    // };

    const handleSubmit = async (e) => {
        console.log(int_req_id)

        const status_before = () => {
            if (Data.benefitStatus === "existing") {
                // console.log("exxxxxxxxxx")
                return Data.hospitalName
            }
            else if (Data.benefitStatus === "other") {
                // console.log("other")
                return Data.otherStatus
            }
            else if (Data.benefitStatus === "goverment") {
                // console.log("goverment")
                return "-"
            }
            else if (Data.benefitStatus === "social") {
                // console.log("social")
                return "-"
            }
        }
        const id = Data.id
        e.preventDefault();
        try {

            if (!validateForm()) {
                return; // หยุดตรงนี้ถ้า validate ไม่ผ่าน
            }
            notifyinprocess()
            await axios.put(`/api/UHC?id=${int_req_id}`, {
                Student: {
                    id: id,
                    lnameTH: Data.Surname,
                    fnameTH: Data.Name,
                    facultyNameTH: Data.facultyNameTH,
                    year: Data.year,
                    bd: formatDateToISO(Data.birthDate),
                    tel_num: Data.Telnumber,
                    title: Data.Nametitle,
                    thai_id: Data.citizenId,
                    contactable_tel: Data.Contactphone,
                    thai_id_card_issured: formatDateToISO(Data.Idcardissuedate),
                    thai_id_card_expired: formatDateToISO(Data.Idcardexpiraiton),
                    personal_email: Data.email,
                    phone_num: Data.Phonenumber,
                },
                UHC_reg_info: {
                    id: id,
                    smart_card_issured: Data.Idcardissuedate,
                    smart_card_expired: Data.Idcardexpiraiton,
                    status_before_reg: Data.benefitStatus,
                    status_info: status_before(),
                    frequence_uses: Data.hospitalService,
                    is_been: isTrueSet(Data.usedHospitalBefore),
                    is_congenital_disease: isTrueSet(Data.hasChronicDisease),
                },
                DOPA_address: {
                    id: id,
                    house_num: Data.domicileNumber,
                    house_moo: Data.house_moo,
                    soi: Data.soi,
                    street: Data.road,
                    subdistrict: Data.district,
                    district: Data.amphure,
                    province: Data.province,
                    postal_code: Data.zipCode,
                }
            })

            if (int_req_id !== 0) {
                const response = await axios.post(`/api/POSTPDF/updatestatus?id=${int_req_id}`, {
                    province: Data.province,
                    district: Data.amphure,
                    hospital: status_before(),
                })
                console.log("ID return", response.data.id);
                router.push(`/student/${studentId}/golden_card/Doc/${response.data.id}`)
            } else {
                const response = await axios.post(`/api/POSTPDF/create`, {
                    province: Data.province,
                    district: Data.amphure,
                    hospital: status_before(),
                })
                console.log("ID return", response.data.id);
                router.push(`/student/${studentId}/golden_card/Doc/${response.data.id}`)
            }
            notifysuccess()
            // router.push(`/golden_card/Doc/${response.id}`)
        } catch (error) {
            notifyerror()
            console.error('Form submission error:', error);
            // router.push("/golden_card/Doc")
        }

    };
    const onChange = (date, dateString) => {
        console.log(date);
    };


    return (
        <div>
            <Header req1="แบบคำขอรับรองคุณสมบัติในการเข้าร่วมโครงการประกันสุขภาพถ้วนหน้า (กรุงเทพมหานคร) สำหรับนิสิตจุฬาลงกรณ์มหาวิทยาลัย และ หนังสือข้อตกลงขอขึ้นทะเบียนบัตรประกันสุขภาพถ้วนหน้า โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย" req2="" />
            <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">
                <main className="flex justify-center items-center ">
                    <div className="bg-white p-8 w-full ">
                        <section className="ml-5">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-semibold mb-4 ">
                                    ข้อมูลส่วนตัว (Personal information)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full  ">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">คำนำหน้า (Title)</label>
                                            <input
                                                type="text"
                                                name="Nametitle"
                                                value={Data.Nametitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nametitle"

                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อ (Name)</label>
                                            <input
                                                type="text"
                                                name="Name"
                                                value={Data.Name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Name-Surname"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">นามสกุล (Surname)</label>
                                        <input
                                            type="text"
                                            name="Surname"
                                            value={Data.Surname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Surname"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">คณะ (Faculty)</label>
                                        <input
                                            type="text"
                                            name="facultyNameTH"
                                            value={Data.facultyNameTH}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Faculty"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">ชั้นปี (Year)</label>
                                        <input
                                            type="text"
                                            name="year"
                                            value={Data.year}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Year"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขบัตรประชาชน (Identification number)</label>

                                        <PatternFormat
                                            type="text"
                                            name="citizenId"
                                            value={Data.citizenId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            format="#############"
                                            allowEmptyFormatting
                                            mask="_"
                                        />

                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            วันที่ออกบัตรประชาชน (Issue date of ID card)
                                        </label>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            value={Data.Idcardissuedate ? dayjs(Data.Idcardissuedate, "YYYY-MM-DD") : null}
                                            onChange={(date) => {
                                                handleChange({
                                                    target: {
                                                        name: "Idcardissuedate",
                                                        value: format(date, "yyyy-MM-dd"),
                                                    },
                                                });
                                            }}
                                            allowClear={false}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">วันที่บัตรบัตรประชาชนหมดอายุ (Exp date of Id card )</label>
                                        <DatePicker
                                            allowClear={false}
                                            format="DD/MM/YYYY"
                                            value={Data.Idcardexpiraiton ? dayjs(Data.Idcardexpiraiton, "YYYY-MM-DD") : null}
                                            onChange={(date) => {
                                                handleChange({
                                                    target: {
                                                        name: "Idcardexpiraiton",
                                                        value: format(date, "yyyy-MM-dd"),
                                                    },
                                                });
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>
                                    <div className="flex item-center space-x-4 w-full">
                                        <div className="w-1/2">

                                            <label className="block text-gray-700 mb-2">วันเกิด (Date of birth)</label>
                                            <DatePicker

                                                allowClear={false}
                                                format="DD/MM/YYYY"
                                                value={Data.birthDate ? dayjs(Data.birthDate, "YYYY-MM-DD") : null}
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
                                            <label className="block text-gray-700 mb-2">อาชีพ (Occupation)</label>
                                            <input
                                                type="text"
                                                name="Job"
                                                value={Data.Job}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Occupation"
                                            />
                                        </div>
                                    </div>

                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์มือถือ (Mobile number)</label>
                                        <input
                                            type="text"
                                            name="Phonenumber"
                                            value={Data.Phonenumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Mobile number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">หมายเลขโทรศัพท์ที่ติดต่อได้ (Contact phone number)</label>
                                        <input
                                            type="text"
                                            name="Contactphone"
                                            value={Data.Contactphone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Contact phone number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อีเมล (Email)</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={Data.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="E-mail"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                    ที่อยู่จริงตามทะเบียนบ้าน (Current address)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขที่บ้าน (Address number)</label>
                                        <input
                                            type="text"
                                            name="domicileNumber"
                                            value={Data.domicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Address Number"
                                        />
                                    </div>                  <div>
                                        <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                        <input
                                            type="text"
                                            name="house_moo"
                                            value={Data.house_moo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Moo"
                                        />
                                    </div>                  <div>
                                        <label className="block text-gray-700 mb-2">ตรอก/ซอย (Soi)</label>
                                        <input
                                            type="text"
                                            name="soi"
                                            value={Data.soi}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Soi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                                        <input
                                            type="text"
                                            name="road"
                                            value={Data.road}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Road"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="province"
                                            value={Data.province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.province}>{Data.province}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="amphure"
                                            value={Data.amphure}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={Data.amphure}>{Data.amphure}</option>
                                            {amphures.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={Data.district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <PatternFormat
                                            type="text"
                                            name="zipCode"
                                            value={Data.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            format="#####"
                                            allowEmptyFormatting
                                            mask="_"
                                        />
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์ (Phone number)</label>
                                        <input
                                            type="text"
                                            name="Telnumber"
                                            value={Data.Telnumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Phone number"
                                        />
                                    </div>

                                </div>


                                <h3 className="text-lg flex font-semibold mb-4 pt-10 ">
                                    สถานะก่อนลงทะเบียน (Pre-registration status)
                                    <div className='flex items-center'>

                                        <a
                                            href="/Goldencard.JPG"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='mt-1'
                                        >
                                            <QuestionCircleOutlined style={{ color: "red", fontSize: "larger", marginLeft: "10px" }} />
                                        </a>
                                    </div>
                                </h3>

                                <div>
                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="existing"
                                            name="benefitStatus"
                                            value="existing"
                                            checked={Data.benefitStatus === "existing"}
                                            onChange={handleChange}
                                        />
                                        <div>
                                            <label htmlFor="existing" className="block text-gray-700">
                                                สิทธิหลักประกันสุขภาพแห่งชาติ โรงพยาบาล
                                                <input
                                                    type="text"
                                                    name="hospitalName"
                                                    onChange={handleChange}
                                                    value={Data.hospitalName}
                                                    className="border rounded-lg px-2 py-1 ml-2"
                                                    placeholder="ชื่อโรงพยาบาล"
                                                    disabled={Data.benefitStatus !== "existing"}
                                                />
                                                <br />
                                            </label>
                                            <div
                                                className="text-red-500 text-sm"
                                            >
                                                สามารถตรวจสอบสิทธิ์เดิมได้ที่เว็บไซต์ของ สปสช.
                                            </div>
                                        </div>
                                    </div>



                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="goverment"
                                            name="benefitStatus"
                                            value="goverment"
                                            checked={Data.benefitStatus === "goverment"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="goverment" className="block text-gray-700">
                                            สิทธิสวัสดิการข้าราชการ
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="social"
                                            name="benefitStatus"
                                            value="social"
                                            checked={Data.benefitStatus === "social"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="social" className="block text-gray-700">
                                            สิทธิประกันสังคม
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 py-2">
                                        <input
                                            type="radio"
                                            id="other"
                                            name="benefitStatus" // ใช้ name เดียวกันสำหรับ radio ทั้งหมด
                                            value="other"
                                            checked={Data.benefitStatus === "other"}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="other" className="block text-gray-700">
                                            อื่น ๆ ระบุ
                                            <input
                                                type="text"
                                                name="otherStatus"
                                                onChange={handleChange}
                                                className="border rounded-lg px-2 py-1 ml-2"
                                                placeholder="โปรดระบุ"
                                                value={Data.otherStatus}
                                                disabled={Data.benefitStatus !== "other"} // ปิดการกรอกถ้าไม่ใช่ตัวเลือกนี้
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="pt-10"><label className="text-lg font-semibold text-black pt-10">ท่านมีแนวโน้มที่จะใช้บริการ รพ.จุฬาลงกรณ์</label></div>
                                <div className="flex space-x-4 w-full pt-4">
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            id="hospitaluse"
                                            name="hospitalService"
                                            value="1"
                                            checked={Data.hospitalService === '1'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitaluse" className="block text-gray-700">
                                            ใช้
                                        </label>

                                    </div>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            id="hospitalnotuse"
                                            name="hospitalService"
                                            value="2"
                                            checked={Data.hospitalService === '2'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitalnotuse" className="block text-gray-700">
                                            ไม่ใช้
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="radio"
                                            name="hospitalService"
                                            value="3"
                                            id="hospitalnotsure"
                                            checked={Data.hospitalService === '3'}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="hospitalnotsure" className="block text-gray-700">
                                            ไม่แน่ใจ
                                        </label>
                                    </div>
                                </div>



                                <div className="pt-10"><label className="text-lg font-semibold text-black" >ท่านเคยใช้บริการที่ รพ.จุฬาลงกรณ์</label></div>
                                <div>
                                    <div className="flex space-x-4 w-full pt-4">
                                        <div className="flex items-center space-x-4 w-1/3">
                                            <input
                                                type="radio"
                                                id="usedHospitalBefore"
                                                name="usedHospitalBefore"
                                                value={true} // Boolean value
                                                checked={isTrueSet(Data.usedHospitalBefore) === true} // Compare with Boolean
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="usedHospitalBefore" className="block text-gray-700">
                                                เคย
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-4 w-1/3">
                                            <input
                                                type="radio"
                                                id="notusedHospitalBefore"
                                                name="usedHospitalBefore"
                                                value={false} // Boolean value
                                                checked={isTrueSet(Data.usedHospitalBefore) === false} // Compare with Boolean
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="notusedHospitalBefore" className="block text-gray-700">
                                                ไม่เคย
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <div className="pt-10"><label className="text-lg font-semibold text-black" > ท่านมีโรคประจำตัวหรือไม่</label></div>
                                <div>
                                    <div className="flex space-x-4 w-full pt-4">
                                        <div className="flex items-center space-x-4 w-1/3" >

                                            <input
                                                type="radio"
                                                name="hasChronicDisease"
                                                id="hasChronicDisease"
                                                value={true}
                                                checked={isTrueSet(Data.hasChronicDisease) === true}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="hasChronicDisease" className="block text-gray-700">
                                                มี
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-4 w-1/3" >
                                            <input
                                                type="radio"
                                                name="hasChronicDisease"
                                                id="nothasChronicDisease"
                                                value={false}
                                                checked={isTrueSet(Data.hasChronicDisease) === false}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="nothasChronicDisease" className="block text-gray-700">
                                                ไม่มี
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex justify-between mt-8">
                                    <a onClick={() => router.push(`/student/${studentId}/home`)}>
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                        >
                                            Back
                                        </button>
                                    </a>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                    >
                                        Check data
                                        <ToastContainer />
                                    </button>
                                </div>


                            </form>
                        </section>
                    </div>
                </main>
            </div >
        </div >

    )
}

export default page