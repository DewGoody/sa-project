// pages/rordor/checkData.js
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../../../../../components/Header';
import { useFormData } from '../../../../../../contexts/RDDataContext'; // Adjust the import path as necessary
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const notifyerror = () => {
    toast.error('👆🏻 กรอกข้อมูลให้ถูกต้อง', {
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
const notifyinprocess = () => {
    toast.info('Inprocess', {
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
const notifysuccess = () => {
    toast.success('Succes', {
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
const CheckData = () => {
    const { formData, updateFormData } = useFormData();
    const { token } = useParams();
    const { updateDataid } = useFormData()
    const router = useRouter();
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provincesmilitary, setProvincesmilitary] = useState([]);
    const [amphuresmilitary, setAmphuresmilitary] = useState([]);
    const [districtsmilitary, setDistrictsmilitary] = useState([]);
    const { form } = useParams()
    const { admin } = useParams()
    const int_form = parseInt(form)
    useEffect(() => {
        if (form) {
            console.log("เลขform", int_form)
            updateDataid({ int_form })
        }
    }, [form, updateDataid])
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

    const fetchProvincesmilitary = async () => {
        try {
            const response = await axios.get("/api/Province");
            setProvincesmilitary(response.data);
        } catch (err) {
            console.log("Error fetching provinces: " + err);
        }
    };

    const fetchAmphuresByIdmilitary = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresmilitary(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistrictsByIdmilitary = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsmilitary(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };


    useEffect(() => {
        fetchProvinces();
        fetchProvincesmilitary();
    }, []);

    const handleback = () => {
        // router.push(`/rordor/${int_form}`);
        console.log("Button clicked, int_form value:", int_form);
        if (admin == "0") {
            console.log("in if");
            // if (!int_form || isNaN(int_form)) {
            //     console.error("Invalid int_form value:", int_form);
            //     return;
            // }
            router.push(`/student/${token}/rordor/${int_form}`);
            return
        }
        if (admin == "1") {
            router.push(`/Admin/rd/0`);
            return
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });

        if (name === "province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresById(id);
        } else if (name === "amphure") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsById(id);
        } else if (name === "militaryProvince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdmilitary(id);
        } else if (name === "militaryDistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdmilitary(id);
        }
    };
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return;
        }
        return date.toISOString();
    };
    useEffect(() => {
        console.log(formData);

    }, [formData])
    const id = formData.id
    const dataforsentlog = {
        student: {
            id: formData.id,
            title: formData.Nametitle,
            fnameTH: formData.Name,
            lnameTH: formData.Surname,
            thai_id: formData.citizenId,
            bd: formData.birthDate,
            religion: formData.religion,
            race: formData.ethnicity,
            nationality: formData.nationality,
            personal_email: formData.email,
            phone_num: formData.phone_num,
            // tel_num: formData.tel_num,
        },
        Military_info: {
            id: id,
            grade9_gpax: formData.grade9GPAX,
            grade9_school: formData.school,
            grade9_province: formData.schoolProvince,
        },
        addresses: {
            DOPA_address: {
                id: id,
                house_num: formData.domicileNumber,
                street: formData.road,
                district: formData.amphure,
                province: formData.province,
                postal_code: (formData.zipCode),
                subdistrict: formData.district

            },
            Military_address: {
                id: id,
                district: formData.militaryDistrict,
                province: formData.militaryProvince,
                subdistrict: formData.militaryAmphure,
                house_num: formData.militaryDomicileNumber
            },
        },
        guardian_info: {
            id: id,
            guardian_fname: formData.ParentName,
            guardian_lname: formData.ParentSurname,
            guardian_title: formData.Parenttitle,
            guardian_occupation: formData.Parentjob,
            guardian_age: parseInt(formData.Parentage),
            guardian_relation: formData.Parentrelated,
            guardian_address: formData.ParentworkAddress
        },
        father_mother_info: {
            father: {
                id: id,
                relation: "father",
                fname: formData.fatherName,
                lname: formData.fatherSurname,
                occupation: formData.occupationfather
            },
            mother: {
                id: id,
                relation: "mother",
                fname: formData.motherName,
                lname: formData.motherSurname,
                occupation: formData.occupationmother
            }
        },
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            notifyinprocess()
            await axios.put(`/api/militaryapi/student?id=${int_form}`, {
                fnameTH: formData.Name,
                lnameTH: formData.Surname,
                fnameEN: formData.fnameEN || "",
                lnameEN: formData.lnameEN || "",
                fac_id: '',
                title: formData.Nametitle,
                dept: '',
                tel_num: '',
                year: formData.Collage_Year || '',
                thai_id: formData.citizenId,
                bd: formatDateToISO(formData.birthDate),
                religion: formData.religion,
                race: formData.ethnicity,
                nationality: formData.nationality,
            })

            await axios.put(`/api/military?id=${int_form}`, {
                student: {
                },
                Military_info: {
                    id: id,
                    grade9_gpax: formData.grade9GPAX,
                    grade9_school: formData.school,
                    grade9_province: formData.schoolProvince,
                },
                addresses: {
                    DOPA_address: {
                        id: id,
                        house_num: formData.domicileNumber,
                        street: formData.road,
                        district: formData.amphure,
                        province: formData.province,
                        postal_code: (formData.zipCode),
                        subdistrict: formData.district

                    },
                    Military_address: {
                        id: id,
                        district: formData.militaryDistrict,
                        province: formData.militaryProvince,
                        subdistrict: formData.militaryAmphure,
                        house_num: formData.militaryDomicileNumber
                    },
                },
                guardian_info: {
                    id: id,
                    guardian_fname: formData.ParentName,
                    guardian_lname: formData.ParentSurname,
                    guardian_title: formData.Parenttitle,
                    guardian_occupation: formData.Parentjob,
                    guardian_age: parseInt(formData.Parentage),
                    guardian_relation: formData.Parentrelated,
                    guardian_address: formData.ParentworkAddress
                },
                father_mother_info: {
                    father: {
                        id: id,
                        relation: "father",
                        fname: formData.fatherName,
                        lname: formData.fatherSurname,
                        occupation: formData.occupationfather
                    },
                    mother: {
                        id: id,
                        relation: "mother",
                        fname: formData.motherName,
                        lname: formData.motherSurname,
                        occupation: formData.occupationmother
                    }
                },


            })
            notifysuccess()

            if (admin == 0) {
                if (int_form !== 0) {
                    await axios.post(`/api/logRd/update?id=${int_form}`, (dataforsentlog))
                    router.push(`/student/${token}/rordor/${int_form}/Doc`)

                }
                else {
                    const response = await axios.post(`/api/logRd/create`, (dataforsentlog))
                    const formId = response.data.data.id
                    console.log("generate formID", formId);
                    router.push(`/student/${token}/rordor/${formId}/Doc`)
                }
            }
            else {
                router.push(`/Admin/rd/0`)
            }


        } catch (error) {
            notifyerror()
            console.log(formData)
            console.error('Form submission error:', error);


        }
    };

    return (
        <div><Header req1="การสมัครเป็น นศท. ปี 1 (ผู้ไม่เคยศึกษาวิชาทหาร) " req2="" />
            <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">

                <main className="flex justify-center items-center ">
                    <div className="bg-white p-8 w-full ">


                        <section className="ml-5">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-semibold mb-4 ">
                                    ข้อมูลส่วนตัวและภูมิลำเนา (Personal & contact information)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                    <div className="flex space-x-4 w-full  ">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">คำนำหน้า (Title)</label>
                                            <input
                                                type="text"
                                                name="Nametitle"
                                                value={formData.Nametitle}
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
                                                value={formData.Name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Name-Surname"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 ">สกุล (Surname)</label>
                                        <input
                                            type="text"
                                            name="Surname"
                                            value={formData.Surname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                                            placeholder="Surname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขบัตรประชาชน (Identification number)</label>
                                        <input
                                            type="text"
                                            name="citizenId"
                                            value={formData.citizenId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Identification number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">วันเกิด (Date of birth)</label>
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Date of birth"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">เชื้อชาติ (Ethnicity)</label>
                                        <input
                                            type="text"
                                            name="ethnicity"
                                            value={formData.ethnicity}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Ethnicity"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Nationality"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ศาสนา (Religion)</label>
                                        <input
                                            type="text"
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Religion"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10">
                                        ข้อมูลผู้ปกครอง (Parent information)
                                    </h3>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's name)</label>
                                        <input
                                            type="text"
                                            name="fatherName"
                                            value={formData.fatherName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Father Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">นามสกุลบิดา (Father's surname)</label>
                                        <input
                                            type="text"
                                            name="fatherSurname"
                                            value={formData.fatherSurname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Father Surname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อาชีพของบิดา (Father's occupation)</label>
                                        <input
                                            type="text"
                                            name="occupationfather"
                                            value={formData.occupationfather}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Father's occupation"
                                        />
                                    </div>
                                    <div></div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ชื่อมารดา (Mother's name)</label>
                                        <input
                                            type="text"
                                            name="motherName"
                                            value={formData.motherName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Mother Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">นามสกุลมารดา (Mother's surname)</label>
                                        <input
                                            type="text"
                                            name="motherSurname"
                                            value={formData.motherSurname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Mother Surname"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อาชีพของมารดา (Mother's occupation)</label>
                                        <input
                                            type="text"
                                            name="occupationmother"
                                            value={formData.occupationmother}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Mother's occupation"
                                        />
                                    </div>

                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ที่อยู่ปัจจุบัน (Current address)
                                    </h3>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">บ้านเลขที่ (Address number)</label>
                                        <input
                                            type="text"
                                            name="domicileNumber"
                                            value={formData.domicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Address Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ถนน (Road)</label>
                                        <input
                                            type="text"
                                            name="road"
                                            value={formData.road}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Road"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value="">{formData.province !== undefined ? formData.province : 'เลือกจังหวัด (select province)'}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="amphure"
                                            value={formData.amphure}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value="">{formData.amphure !== undefined ? formData.amphure : 'เลือกอำเภอ (select district)'}</option>
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
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>

                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ภูมิลำเนาทหาร (Military domicile)
                                    </h3>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">บ้านเลขที่ (Address number)</label>
                                        <input
                                            type="text"
                                            name="militaryDomicileNumber"
                                            value={formData.militaryDomicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Address Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="militaryProvince"
                                            value={formData.militaryProvince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value="">{formData.militaryProvince !== undefined ? formData.militaryProvince : 'เลือกจังหวัด (select province)'}</option>
                                            {provincesmilitary.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="militaryDistrict"
                                            value={formData.militaryDistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.militaryDistrict}>{formData.militaryDistrict !== undefined ? formData.militaryDistrict : "เลือกอำเภอ (select district)"}</option>
                                            {amphuresmilitary.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="militaryAmphure"
                                            value={formData.militaryAmphure}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ประวัติการเรียน (Academic record)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">สำเร็จชั้น ม.3 คะแนนเฉลี่ย (Grade 9 GPAX)</label>
                                        <input
                                            type="text"
                                            name="grade9GPAX"
                                            value={formData.grade9GPAX}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Grade 9 GPAX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">โรงเรียน (School)</label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={formData.school}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="School"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="schoolProvince"
                                            value={formData.schoolProvince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value="">{formData.schoolProvince !== undefined ? formData.schoolProvince : 'เลือกจังหวัด (Select province)'}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">คำยินยอมจากผู้ปกครอง (Parental consent)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-gray-700 mb-2">คำนำหน้าชื่อผู้ปกครอง (Parent's name title)</label>
                                        <input
                                            type="text"
                                            name="'stitle"
                                            value={formData.Parenttitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ชื่อผู้ปกครอง (Parent's name)</label>
                                        <input
                                            type="text"
                                            name="ParentName"
                                            value={formData.ParentName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">นามสกุลผู้ปกครอง (Parent's surname)</label>
                                        <input
                                            type="text"
                                            name="ParentSurname"
                                            value={formData.ParentSurname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Surname"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">อายุผู้ปกครอง (Parent's age)</label>
                                        <input
                                            type="text"
                                            name="Parentage"
                                            value={formData.Parentage}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Age"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อาชีพผู้ปกครอง (Parent's occupation)</label>
                                        <input
                                            type="text"
                                            name="Parentjob"
                                            value={formData.Parentjob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Job"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงานผู้ปกครอง (Parent's work address)</label>
                                        <input
                                            type="text"
                                            name="ParentworkAddress"
                                            value={formData.ParentworkAddress}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Work Address"
                                        />
                                    </div>
                                    <div>
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
                                </div>
                                {admin == 0 && (
                                    <div className="flex justify-between mt-8">

                                        <button
                                            onClick={event => handleback()}
                                            type="button"
                                            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            // onClick={notify}

                                            className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                        >
                                            Next
                                            <ToastContainer />
                                        </button>
                                    </div>
                                )}
                                {admin == 1 && (
                                    <div className="flex justify-between mt-8">
                                        <button
                                            onClick={event => handleback()}
                                            type="button"
                                            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            // onClick={notify}

                                            className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                        >
                                            Confirm
                                            <ToastContainer />
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default CheckData;