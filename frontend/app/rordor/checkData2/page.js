
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../components/Header';
import { useFormData } from '../../contexts/FormDataContext';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Personal } from './RD2_notfatch';
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
    const [inputlist_education, setinputlist_education] = useState([
        { RD2_Grade1: '', RD2_Level1: '', RD2_Major1: '', RD2_Academy1: '' },
    ]);

    const handleinputchange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputlist_education];
        list[index][name] = value;

        // Generate keys dynamically based on index
        const gradeKey = `RD2_Grade${index + 1}`;
        const levelKey = `RD2_Level${index + 1}`;
        const majorKey = `RD2_Major${index + 1}`;
        const academyKey = `RD2_Academy${index + 1}`;

        // Update formData with the correct keys
        updateFormData({
            [gradeKey]: list[index].RD2_Grade1,
            [levelKey]: list[index].RD2_Level1,
            [majorKey]: list[index].RD2_Major1,
            [academyKey]: list[index].RD2_Academy1,
        });
        setinputlist_education(list);
    };

    const handledeleteclick = (index) => {
        const list = [...inputlist_education];
        list.splice(index, 1);
        setinputlist_education(list);
    };

    const handleaddclick = () => {
        setinputlist_education([...inputlist_education, { RD2_Grade1: '', RD2_Level1: '', RD2_Major1: '', RD2_Academy1: '' }])
    }

    const { formData, updateFormData } = useFormData();
    const router = useRouter();
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [amphuresmilitary, setAmphuresmilitary] = useState([]);
    const [districtsmilitary, setDistrictsmilitary] = useState([]);

    const [amphuresmather, setAmphuresmather] = useState([]);
    const [districtsmather, setDistrictsmather] = useState([]);

    const [amphuresfather, setAmphuresfather] = useState([]);
    const [districtsfather, setDistrictsfather] = useState([]);

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
    const fetchAmphuresByIdmather = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresmather(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistrictsByIdmather = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsmather(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };
    const fetchAmphuresByIdfather = async (id) => {
        try {
            console.log("ampofsjdpkfjskf")
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresfather(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };
    const fetchDistrictsByIdfather = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsfather(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };
    useEffect(() => {
        fetchProvinces();
    }, []);
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
        } else if (name === "matherprovince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdmather(id);
        } else if (name === "matherdistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdmather(id);
        } else if (name === "fatherprovince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdfather(id);
        } else if (name === "fatherdistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdfather(id);
        }
    };
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const id = formData.id
        console.log(id)
        try {
            notifyinprocess()
            await axios.put(`/api/profile`, {
                title: formData.Nametitle,
                fnameTH: formData.Name,
                lnameTH: formData.Surname,
                fnameEN: formData.fnameEN || "", // Ensure fnameEN is provided
                lnameEN: formData.lnameEN || "",
                fac_id: '',
                facultyNameTH: '',
                dept: '',
                tel_num: '',
                title: '',
                year: '',
                tel_num: '',
                thai_id: formData.citizenId,
                bd: formatDateToISO(formData.birthDate),
                religion: formData.religion,
                race: formData.ethnicity,
                nationality: formData.nationality,
            })

            await axios.put(`/api/military`, {
                military_course: {
                    id: id,
                    grade9_gpax: formData.grade9GPAX,
                    grade9_school: formData.school,
                    grade9_province: formData.schoolProvince,
                    father_mother_relationship: formData.Parentrelated,
                },
                DOPA_address: {
                    id: id,
                    address_type: "DOPA_address",
                    district: formData.amphure,
                    province: formData.province,
                    postal_code: parseInt(formData.zipCode),
                    subdistrict: formData.district

                },
                military_address: {
                    id: id,
                    address_type: "Military_address",
                    district: formData.militaryDistrict,
                    province: formData.militaryProvince,
                    subdistrict: formData.militaryAmphure,
                    house_num: formData.militaryDomicileNumber
                },
                parent_info: {
                    id: id,
                    parent_fname: formData.ParentName,
                    parent_lname: formData.ParentSurname,
                    title: formData.Parenttitle,
                    occupation: formData.Parentjob,
                    age: parseInt(formData.Parentage),
                    parent_relation: formData.Parentrelated,
                    parent_address: formData.ParentworkAddress
                },
                father_into: {
                    id: id,

                    relation: "father",
                    fname: formData.fatherName,
                    fname: formData.fatherSurname,
                },
                mother_into: {
                    id: id,
                    relation: "mother",
                    fname: formData.motherName,
                    lname: formData.motherSurname,
                    mf_occupation: formData.occupation
                }

            })
            notifysuccess()
            router.push("/rordor/Doc")
        } catch (error) {
            notifyerror()
            console.log(formData)
            console.error('Form submission error:', error);
            // router.push("/rordor/Doc")


        }
    };
    return (
        <div><Header req1="รายงานตัวนักศึกษาวิชาทหาร  " req2="" />
            <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">

                <main className="flex justify-center items-center ">
                    <div className="bg-white p-8 w-full ">
                        <section className="ml-5">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Personal />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ที่อยู่ปัจจุบัน (Current address)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขที่บ้าน (Domicile number)</label>
                                        <input
                                            type="text"
                                            name="domicileNumber"
                                            value={formData.domicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Domicile Number"
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
                                            <option value={formData.province}>{formData.province}</option>
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
                                            <option value={formData.amphure}>{formData.amphure}</option>
                                            {amphures.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.district}>{formData.district}</option>
                                            {districts.map((district, index) => (
                                                <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <select
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.zipCode}>{formData.zipCode}</option>
                                            {districts.map((district, index) => (
                                                <option key={index} value={district.zipCode}>{district.zipCode}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">คำยินยอมจากผู้ปกครอง (Parental consent)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">คำนำหน้าชื่อผู้ปกครอง (Parent name title)</label>
                                            <input
                                                type="text"
                                                name="Parenttitle"
                                                value={formData.Parenttitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Parent title"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อผู้ปกครอง (Parent name)</label>
                                            <input
                                                type="text"
                                                name="ParentName"
                                                value={formData.ParentName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Parent Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">นามสกุลผู้ปกครอง (Parent surname)</label>
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
                                        <label className="block text-gray-700 mb-2">อายุผู้ปกครอง (Parent age)</label>
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
                                        <label className="block text-gray-700 mb-2">อาชีพผู้ปกครอง (Parent job)</label>
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
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ข้อมูลบิดา (Father's information)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อบิดา (Father's name)</label>
                                            <input
                                                type="text"
                                                name="fatherName"
                                                value={formData.fatherName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Father's name"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">นามสกุลบิดา (Father's surname)</label>
                                            <input
                                                type="text"
                                                name="fatherSurname"
                                                value={formData.fatherSurname}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Father's surname"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                            <input
                                                type="text"
                                                name="fatherNationality"
                                                value={formData.fatherNationality}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nationality"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อาชีพ (Job)</label>
                                            <input
                                                type="text"
                                                name="fatherjob"
                                                value={formData.fatherjob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Job"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work Address)</label>
                                        <input
                                            type="text"
                                            name="fatherwherejob"
                                            value={formData.fatherwherejob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Work Address"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (TOT phone)</label>
                                            <input
                                                type="text"
                                                name="fatherjobTST"
                                                value={formData.fatherjobTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="TOT phone"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Phone number)</label>
                                            <input
                                                type="text"
                                                name="fatherphone"
                                                value={formData.fatherphone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>

                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ปัจจุบัน บ้านเลขที่ (Current address, house number)</label>
                                        <input
                                            type="text"
                                            name="fatherhome"
                                            value={formData.fatherhome}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Current address, house number"
                                        />
                                    </div>

                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo No)</label>
                                            <input
                                                type="text"
                                                name="fathermoo"
                                                value={formData.fathermoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo No"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (TOT phone)</label>
                                            <input
                                                type="text"
                                                name="fatherhomeTST"
                                                value={formData.fatherhomeTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="TOT phone"
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="fatherprovince"
                                            value={formData.fatherprovince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.fatherprovince}>{formData.fatherprovince}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อำเภอ (District)</label>
                                        <select
                                            name="fatherdistrict"
                                            value={formData.fatherdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.fatherdistrict}>{formData.fatherdistrict}</option>
                                            {amphuresfather.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ตำบล (Amphure)</label>
                                        <select
                                            name="fathersubdistrict"
                                            value={formData.fathersubdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.fathersubdistrict}>{formData.fathersubdistrict}</option>
                                            {districtsfather.map((district, index) => (
                                                <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <select
                                            name="fatherzipcode"
                                            value={formData.fatherzipcode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.fatherzipcode}>{formData.fatherzipcode}</option>
                                            {districtsfather.map((district, index) => (
                                                <option key={index} value={district.zipCode}>{district.zipCode}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ข้อมูลมารดา (Mather's information)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อมารดา (Mather's name)</label>
                                            <input
                                                type="text"
                                                name="matherName"
                                                value={formData.matherName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="mather's name"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">นามสกุลบิดา (Mather's surname)</label>
                                            <input
                                                type="text"
                                                name="matherSurname"
                                                value={formData.matherSurname}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="mather's surname"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                            <input
                                                type="text"
                                                name="matherNationality"
                                                value={formData.matherNationality}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nationality"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อาชีพ (Job)</label>
                                            <input
                                                type="text"
                                                name="matherjob"
                                                value={formData.matherjob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Job"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work Address)</label>
                                        <input
                                            type="text"
                                            name="matherwherejob"
                                            value={formData.matherwherejob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Work Address"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (TOT phone)</label>
                                            <input
                                                type="text"
                                                name="matherjobTST"
                                                value={formData.matherjobTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="TOT phone"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Phone number)</label>
                                            <input
                                                type="text"
                                                name="matherphone"
                                                value={formData.matherphone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>

                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ปัจจุบัน บ้านเลขที่ (Current address, house number)</label>
                                        <input
                                            type="text"
                                            name="matherhome"
                                            value={formData.matherhome}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Current address, house number"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo No)</label>
                                            <input
                                                type="text"
                                                name="mathermoo"
                                                value={formData.mathermoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo No"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (TOT phone)</label>
                                            <input
                                                type="text"
                                                name="matherhomeTST"
                                                value={formData.matherhomeTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="TOT phone"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (province)</label>
                                        <select
                                            name="matherprovince"
                                            value={formData.matherprovince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.matherprovince}>{formData.matherprovince}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">อำเภอ (district)</label>
                                        <select
                                            name="matherdistrict"
                                            value={formData.matherdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.matherdistrict}>{formData.matherdistrict}</option>
                                            {amphuresmather.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ตำบล (Subdistrict)</label>
                                        <select
                                            name="mathersubdistrict"
                                            value={formData.mathersubdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.mathersubdistrict}>{formData.mathersubdistrict}</option>
                                            {districtsmather.map((district, index) => (
                                                <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <select
                                            name="matherzipcode"
                                            value={formData.matherzipcode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.matherzipcode}>{formData.matherzipcode}</option>
                                            {districtsmather.map((district, index) => (
                                                <option key={index} value={district.zipCode}>{district.zipCode}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        การศึกษาปัจจุบัน (Current education)
                                    </h3>
                                </div>
                                {
                                    inputlist_education.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">ชั้น (Grade)</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_Grade1"
                                                        value={item.RD2_Grade1}
                                                        onChange={(e) => handleinputchange(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Grade"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">ระดับ (Level)</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_Level1"
                                                        value={item.RD2_Level1}
                                                        onChange={(e) => handleinputchange(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Level"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">คณะ/วิชาเอก (Major)</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_Major1"
                                                        value={item.RD2_Major1}
                                                        onChange={(e) => handleinputchange(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Major"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <div className="flex space-x-4 w-full">
                                                        <div className="w-11/12">
                                                            <label className="block text-gray-700 mb-2">สถานศึกษา (Educational institution)</label>
                                                            <input
                                                                type="text"
                                                                name="RD2_Academy1"
                                                                value={item.RD2_Academy1}
                                                                onChange={(e) => handleinputchange(e, i)}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                                placeholder="Educational institution"
                                                            />
                                                        </div>
                                                        <div className="w-1/12">
                                                            {inputlist_education.length !== 1 && ( // !== 1 แต่บัคแดก
                                                                <button
                                                                    className="w-full py-1 bg-gray-400 text-white font-semibold rounded-lg shadow-md "
                                                                    onClick={() => handledeleteclick(i)} // Wrap in arrow function
                                                                >
                                                                    -
                                                                </button>
                                                            )}
                                                            {inputlist_education.length - 1 === i && inputlist_education.length <= 3 && (
                                                                <button
                                                                    className="py-2 w-full bg-green-400 text-white font-semibold rounded-lg shadow-md"
                                                                    onClick={handleaddclick}
                                                                >
                                                                    +
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        การฝึกวิชาทหาร (Military training)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชั้นปีที่ (Year Level)</label>
                                            <input
                                                type="text"
                                                name="RD2_LevelRD1"
                                                value={formData.RD2_LevelRD1}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Level"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">/</label>
                                            <input
                                                type="text"
                                                name="RD2_LevelRD12"
                                                value={formData.RD2_LevelRD12}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Level"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">สถานศึกษา (Educational institution)</label>
                                            <input
                                                type="text"
                                                name="RD2_AcademyRD1"
                                                value={formData.RD2_AcademyRD1}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Educational institution"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                            <select
                                                name="RD2_ProvinceRD1"
                                                value={formData.RD2_ProvinceRD1}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value={formData.RD2_ProvinceRD1}>{formData.RD2_ProvinceRD1}</option>
                                                {provinces.map((item, index) => (
                                                    <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ภูมิลำเนาทหาร *กรณีขึ้นทะเบียนทหารกองเกินแล้ว(Military domicile *In case of already registered for military conscription)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">ภูมิลำเนาทหารเลขที่ (Military domicile number)</label>
                                        <input
                                            type="text"
                                            name="militaryDomicileNumber"
                                            value={formData.militaryDomicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Military Domicile Number"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div >
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo no)</label>
                                            <input
                                                type="text"
                                                name="militaryMoo"
                                                value={formData.militaryMoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Military Domicile Number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">ซอย (Soi)</label>
                                            <input
                                                type="text"
                                                name="militarySoi"
                                                value={formData.militarySoi}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Military Domicile Number"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัดทหาร (Military province)</label>
                                        <select
                                            name="militaryProvince"
                                            value={formData.militaryProvince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.militaryProvince}>{formData.militaryProvince}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อำเภอทหาร (Military district)</label>
                                            <select
                                                name="militaryDistrict"
                                                value={formData.militaryDistrict}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value={formData.militaryDistrict}>{formData.militaryDistrict}</option>
                                                {amphuresmilitary.map((amphure, index) => (
                                                    <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ตำบลทหาร (Military amphure)</label>
                                            <select
                                                name="militaryAmphure"
                                                value={formData.militaryAmphure}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            >
                                                <option value={formData.militaryAmphure}>{formData.militaryAmphure}</option>
                                                {districtsmilitary.map((district, index) => (
                                                    <option key={index} data-id={district.id} value={district.nameTh}>{district.nameTh}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ภูมิลำเนาทหาร (Military domicile)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* <div>
                                        <label className="block text-gray-700 mb-2">ภูมิลำเนาทหารเลขที่ (Military domicile number)</label>
                                        <input
                                            type="text"
                                            name="militaryDomicileNumber"
                                            value={formData.militaryDomicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Military Domicile Number"
                                        />
                                    </div> */}
                                </div>

                                <div className="flex justify-between mt-8">
                                    <a href="/rordor">
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                                        >
                                            หน้าก่อนหน้า
                                        </button>
                                    </a>
                                    <button
                                        type="submit"
                                        // onClick={notify}

                                        className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                                    >
                                        หน้าถัดไป
                                        <ToastContainer />
                                    </button>
                                </div>

                            </form>
                        </section>
                    </div>
                </main >
            </div >
        </div >
    );
};
export default CheckData;