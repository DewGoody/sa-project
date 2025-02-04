
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../../../components/Header';
import { useFormData } from '../../../../contexts/RDDataContext';
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Personal } from './RD2_personal';
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

    const { updateDataid } = useFormData()
    const { form } = useParams()
    const { admin } = useParams()
    const int_form = parseInt(form)
    useEffect(() => {
        if (form) {
            console.log("เลขform", int_form)
            updateDataid({ int_form })
        }
    }, [form, updateDataid])
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

    const handledeleteclick = (e, index) => {
        e.preventDefault(); // Prevents form submission
        const list = [...inputlist_education];
        list.splice(index, 1);
        setinputlist_education(list);
    };


    const handleaddclick = () => {
        setinputlist_education([...inputlist_education, { RD2_Grade1: '', RD2_Level1: '', RD2_Major1: '', RD2_Academy1: '' }])
    }


    const [inputlist_training, setinputlist_training] = useState([
        { RD2_LevelRD1: '', RD2_LevelRD12: '', RD2_AcademyRD1: '', RD2_ProvinceRD1: '' },
    ]);

    const handleinputchange_training = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputlist_training];
        list[index][name] = value;

        // Generate keys dynamically based on index
        const gradeKey = `RD2_LevelRD${index + 1}`;
        const levelKey = `RD2_LevelRD${index + 1}2`;
        const majorKey = `RD2_AcademyRD${index + 1}`;
        const academyKey = `RD2_ProvinceRD${index + 1}`;

        // Update formData with the correct keys
        updateFormData({
            [gradeKey]: list[index].RD2_LevelRD1,
            [levelKey]: list[index].RD2_LevelRD12,
            [majorKey]: list[index].RD2_AcademyRD1,
            [academyKey]: list[index].RD2_ProvinceRD1,
        });
        setinputlist_training(list);
    };

    const handledeleteclick_training = (e, index) => {
        e.preventDefault(); // Prevents form submission
        const list = [...inputlist_training];
        list.splice(index, 1);
        setinputlist_training(list);
    };


    const handleaddclick_training = () => {
        setinputlist_training([...inputlist_training, { RD2_LevelRD1: '', RD2_LevelRD12: '', RD2_AcademyRD1: '', RD2_ProvinceRD1: '' }])
    }



    const [inputlist_role, setinputlist_role] = useState([{},]);

    const handleinputchange_role = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputlist_role];
        list[index][name] = value;

        // Generate keys dynamically based on index
        const gradeKey = `military_rank${index + 1}`;
        const levelKey = `corps_rank${index + 1}`;
        const majorKey = `command_rank${index + 1}`;
        const academyKey = `date_rank${index + 1}`;

        // Update formData with the correct keys
        updateFormData({
            [gradeKey]: list[index].military_rank1,
            [levelKey]: list[index].corps_rank1,
            [majorKey]: list[index].command_rank1,
            [academyKey]: list[index].date_rank1,
        });
        setinputlist_role(list);
    };

    const handledeleteclick_role = (e, index) => {
        e.preventDefault(); // Prevents form submission
        const list = [...inputlist_role];
        list.splice(index, 1);
        setinputlist_role(list);
    };


    const handleaddclick_role = (e) => {
        e.preventDefault()
        setinputlist_role([...inputlist_role, { military_rank1: '', corps_rank1: '', command_rank1: '', date_rank1: '' }])
    }
    const { formData, updateFormData } = useFormData();
    const router = useRouter();
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [amphures_contactable, setAmphures_amphures_contactable] = useState([]);
    const [districts_contactable, setDistricts_condistricts_contactable] = useState([]);

    const [amphuresmilitary, setAmphuresmilitary] = useState([]);
    const [districtsmilitary, setDistrictsmilitary] = useState([]);

    const [amphuresmother, setAmphuresmother] = useState([]);
    const [districtsmother, setDistrictsmother] = useState([]);

    const [amphuresfather, setAmphuresfather] = useState([]);
    const [districtsfather, setDistrictsfather] = useState([]);

    const [amphuresfollower1, setAmphuresfollower1] = useState([]);
    const [districtsfollower1, setDistrictsfollower1] = useState([]);

    const [amphuresfollower2, setAmphuresfollower2] = useState([]);
    const [districtsfollower2, setDistrictsfollower2] = useState([]);

    useEffect(() => {
        console.log(formData)
    }, [formData])

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
    const fetchAmphures_contactableById = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphures_amphures_contactable(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistricts_contactableById = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistricts_condistricts_contactable(response.data);
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
    const fetchAmphuresByIdmother = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresmother(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };

    const fetchDistrictsByIdmother = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsmother(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };
    const fetchAmphuresByIdfather = async (id) => {
        try {
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

    const fetchAmphuresByIdfollower1 = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresfollower1(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };
    const fetchDistrictsByIdfollower1 = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsfollower1(response.data);
        } catch (err) {
            console.log("Error fetching districts: " + err);
        }
    };

    const fetchAmphuresByIdfollower2 = async (id) => {
        try {
            const response = await axios.get(`/api/Amphure/${id}`);
            setAmphuresfollower2(response.data);
        } catch (err) {
            console.log("Error fetching amphures: " + err);
        }
    };
    const fetchDistrictsByIdfollower2 = async (id) => {
        try {
            const response = await axios.get(`/api/District/${id}`);
            setDistrictsfollower2(response.data);
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
        } else if (name === "militaryProvince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdmilitary(id);
        } else if (name === "militaryDistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdmilitary(id);
        } else if (name === "motherprovince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdmother(id);
        } else if (name === "motherdistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdmother(id);
        } else if (name === "fatherprovince") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdfather(id);
        } else if (name === "fatherdistrict") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdfather(id);
        } else if (name === "follower1_province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdfollower1(id);
        } else if (name === "follower1_district") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdfollower1(id);
        } else if (name === "follower2_province") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphuresByIdfollower2(id);
        } else if (name === "follower2_district") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistrictsByIdfollower2(id);
        } else if (name === "province_contactable") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchAmphures_contactableById(id);
        } else if (name === "amphure_contactable") {
            const id = e.target.selectedOptions[0]?.dataset.id;
            fetchDistricts_contactableById(id);
        }
    };
    const formatDateToISO = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return;
        }
        return date.toISOString();
    };
    function parseDateString(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return { year, month, day };
    }
    const id = formData.id
    console.log("dadshkfjshfkjashfkashfjkadshfjkashkd", id);

    const dataforsentlog = {
        registeryear: formData.YearGradeRD,
        student: {
            student_id: id,
            title: formData.Nametitle,
            fnameTH: formData.Name,
            lnameTH: formData.Surname,
            fnameEN: formData.fnameEN || "", // Ensure fnameEN is provided
            lnameEN: formData.lnameEN || "",
            facultyNameTH: formData.Major,
            year: formData.Collage_Year,
            thai_id: formData.citizenId,
            bd: formatDateToISO(formData.birthDate),
            religion: formData.religion,
            race: formData.ethnicity,
            nationality: formData.nationality,
            tel_num: formData.tel_num,
            phone_num: formData.phone_num,
            personal_email: formData.email,
        },
        Military_info: {
            id: id,
            military_id: formData.citizenRD,
            military_class: formData.YearGradeRD,
            register_type: parseInt(formData.register_type),
            grade9_gpax: formData.grade9GPAX,
            grade9_school: formData.school,
            prev_military_class: formData.BeforeMilitartYear,
            prev_school: formData.Whereform,
            prev_year: formData.YearBefore,
            academic_grade1: formData.RD2_Academy1,
            academic_class1: formData.RD2_Level1,
            academic_major1: formData.RD2_Major1,
            academic_school1: formData.RD2_Academy1,
            academic_grade2: formData.RD2_Academy2,
            academic_class2: formData.RD2_Level2,
            academic_major2: formData.RD2_Major2,
            academic_school2: formData.RD2_Academy2,
            academic_grade3: formData.RD2_Academy3,
            academic_class3: formData.RD2_Level3,
            academic_major3: formData.RD2_Major3,
            academic_school3: formData.RD2_Academy3,
            academic_grade4: formData.RD2_Academy4,
            academic_class4: formData.RD2_Level4,
            academic_major4: formData.RD2_Major4,
            academic_school4: formData.RD2_Academy4,
            military_grade1: formData.RD2_LevelRD1,
            military_year1: formData.RD2_LevelRD12,
            military_school1: formData.RD2_AcademyRD1,
            military_province1: formData.RD2_ProvinceRD1,
            military_grade2: formData.RD2_LevelRD2,
            military_year2: formData.RD2_LevelRD22,
            military_school2: formData.RD2_AcademyRD2,
            military_province2: formData.RD2_ProvinceRD2,
            military_grade3: formData.RD2_LevelRD3,
            military_year3: formData.RD2_LevelRD32,
            military_school3: formData.RD2_AcademyRD3,
            military_province3: formData.RD2_ProvinceRD3,
            military_grade4: formData.RD2_LevelRD4,
            military_year4: formData.RD2_LevelRD42,
            military_school4: formData.RD2_AcademyRD4,
            military_province4: formData.RD2_ProvinceRD4,
            reg_army: formData.Branches,
            reg_corp: formData.corps,
            promo_title1: formData.military_rank1,
            promo_corp1: formData.corps_rank1,
            promo_order1: formData.command_rank1,
            promo_date1: formatDateToISO(formData.date_rank1),
            promo_title2: formData.military_rank2,
            promo_corp2: formData.corps_rank2,
            promo_order2: formData.command_rank2,
            promo_date2: formatDateToISO(formData.date_rank2),
            grade9_province: formData.schoolProvince,
            follower_name1: formData.follower1_name,
            follower_school1: formData.follower1_school,
            follower_telnum1: formData.follower1_telnum,
            follower_phonenum1: formData.follower1_phonenum,
            follower_name2: formData.follower2_name,
            follower_school2: formData.follower2_school,
            follower_telnum2: formData.follower2_telnum,
            follower_phonenum2: formData.follower2_phonenum,
            prev_province: formData.militaryProvince2,
            date_of_study: formatDateToISO(formData.Fristdata_in_U),
        },
        addresses: {
            DOPA_address: {
                id: id,
                house_num: formData.domicileNumber,
                street: formData.road,
                soi: formData.soi,
                house_moo: formData.moo,
                district: formData.amphure,
                province: formData.province,
                postal_code: formData.zipCode,
                subdistrict: formData.district
            },
            Military_address: {
                id: id,
                street: "",
                district: formData.militaryDistrict,
                province: formData.militaryProvince,
                subdistrict: formData.militaryAmphure,
                house_num: formData.militaryDomicileNumber,
                house_moo: formData.militaryMoo,
                soi: formData.militarySoi,
                postal_code: ""
            },
            Father_address: {
                id: id,
                street: "",
                house_num: formData.fatherhome,
                house_moo: formData.fathermoo,
                district: formData.fatherdistrict,
                province: formData.fatherprovince,
                postal_code: (formData.fatherzipcode),
                subdistrict: formData.fathersubdistrict,

            },
            Mother_address: {
                id: id,
                street: "",
                house_num: formData.motherhome,
                house_moo: formData.mothermoo,
                district: formData.motherdistrict,
                province: formData.motherprovince,
                postal_code: (formData.motherzipcode),
                subdistrict: formData.mothersubdistrict,

            },

            Follower_address1: {
                id: id,
                street: "",
                house_num: formData.follower1_housenum,
                house_moo: formData.follower1_housemoo,
                soi: formData.follower1_housemoo,
                district: formData.follower1_district,
                province: formData.follower1_province,
                postal_code: (formData.follower1_postal_code),
                subdistrict: formData.follower1_subdistrict,

            },

            Follower_address2: {
                id: id,
                house_num: formData.follower2_housenum,
                street: "",
                house_moo: formData.follower2_housemoo,
                soi: formData.follower2_housemoo,
                district: formData.follower2_district,
                province: formData.follower2_province,
                postal_code: (formData.follower2_postal_code),
                subdistrict: formData.follower2_subdistrict,

            },
            Contactable_address: {
                id: id,
                house_num: formData.domicileNumber_contactable,
                street: "",
                soi: formData.soi_contactable,
                house_moo: formData.moo_contactable,
                district: formData.amphure_contactable,
                province: formData.province_contactable,
                postal_code: formData.zipCode_contactable,
                subdistrict: formData.district_contactable,
            }
        },
        guardian_info: {
            id: id,
            guardian_fname: formData.ParentName,
            guardian_lname: formData.ParentSurname,
            guardian_title: formData.Parenttitle,
            guardian_occupation: formData.Parentjob,
            guardian_age: parseInt(formData.Parentage),
            guardian_relation: formData.Parentrelated,
            guardian_address: formData.ParentworkAddress,
            guardian_nationality: formData.guardian_nationality,
        },

        father_mother_info: {
            father: {
                id: id,
                title: "",
                fname: formData.fatherName,
                lname: formData.fatherSurname,
                working_place: formData.fatherwherejob,
                phone_num: formData.fatherphone,
                tel_num: formData.fatherjobTST,
                nationality: formData.fatherNationality,
                occupation: formData.occupationfather,
                home_tel: formData.fatherhomeTST,

            },
            mother: {
                id: id,
                title: "",
                fname: formData.motherName,
                lname: formData.motherSurname,
                working_place: formData.motherwherejob,
                phone_num: formData.motherphone,
                tel_num: formData.motherjobTST,
                nationality: formData.motherNationality,
                occupation: formData.occupationmother,
                home_tel: formData.motherhomeTST,
            }
        },
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData)
        const id = formData.id

        try {
            notifyinprocess()
            await axios.put(`/api/militaryapi/student?id=${int_form}`, {
                title: formData.Nametitle,
                fnameTH: formData.Name,
                lnameTH: formData.Surname,
                fnameEN: formData.fnameEN || "", // Ensure fnameEN is provided
                lnameEN: formData.lnameEN || "",
                fac_id: '',
                facultyNameTH: formData.Major,
                dept: '',
                title: '',
                year: formData.Collage_Year,
                thai_id: formData.citizenId,
                bd: formatDateToISO(formData.birthDate),
                religion: formData.religion,
                race: formData.ethnicity,
                nationality: formData.nationality,

            })
            await axios.put(`/api/military?id=${int_form}`, {
                student: {
                    tel_num: formData.tel_num,
                    phone_num: formData.phone_num,
                    personal_email: formData.email,
                },
                Military_info: {
                    id: id,
                    military_id: formData.citizenRD,
                    military_class: formData.YearGradeRD,
                    register_type: parseInt(formData.register_type),
                    grade9_gpax: formData.grade9GPAX,
                    grade9_school: formData.school,
                    prev_military_class: formData.BeforeMilitartYear,
                    prev_school: formData.Whereform,
                    prev_year: formData.YearBefore,
                    academic_grade1: formData.RD2_Academy1,
                    academic_class1: formData.RD2_Level1,
                    academic_major1: formData.RD2_Major1,
                    academic_school1: formData.RD2_Academy1,
                    academic_grade2: formData.RD2_Academy2,
                    academic_class2: formData.RD2_Level2,
                    academic_major2: formData.RD2_Major2,
                    academic_school2: formData.RD2_Academy2,
                    academic_grade3: formData.RD2_Academy3,
                    academic_class3: formData.RD2_Level3,
                    academic_major3: formData.RD2_Major3,
                    academic_school3: formData.RD2_Academy3,
                    academic_grade4: formData.RD2_Academy4,
                    academic_class4: formData.RD2_Level4,
                    academic_major4: formData.RD2_Major4,
                    academic_school4: formData.RD2_Academy4,
                    military_grade1: formData.RD2_LevelRD1,
                    military_year1: formData.RD2_LevelRD12,
                    military_school1: formData.RD2_AcademyRD1,
                    military_province1: formData.RD2_ProvinceRD1,
                    military_grade2: formData.RD2_LevelRD2,
                    military_year2: formData.RD2_LevelRD22,
                    military_school2: formData.RD2_AcademyRD2,
                    military_province2: formData.RD2_ProvinceRD2,
                    military_grade3: formData.RD2_LevelRD3,
                    military_year3: formData.RD2_LevelRD32,
                    military_school3: formData.RD2_AcademyRD3,
                    military_province3: formData.RD2_ProvinceRD3,
                    military_grade4: formData.RD2_LevelRD4,
                    military_year4: formData.RD2_LevelRD42,
                    military_school4: formData.RD2_AcademyRD4,
                    military_province4: formData.RD2_ProvinceRD4,
                    reg_army: formData.Branches,
                    reg_corp: formData.corps,
                    promo_title1: formData.military_rank1,
                    promo_corp1: formData.corps_rank1,
                    promo_order1: formData.command_rank1,
                    promo_date1: formatDateToISO(formData.date_rank1),
                    promo_title2: formData.military_rank2,
                    promo_corp2: formData.corps_rank2,
                    promo_order2: formData.command_rank2,
                    promo_date2: formatDateToISO(formData.date_rank2),
                    grade9_province: formData.schoolProvince,
                    follower_name1: formData.follower1_name,
                    follower_school1: formData.follower1_school,
                    follower_telnum1: formData.follower1_telnum,
                    follower_phonenum1: formData.follower1_phonenum,
                    follower_name2: formData.follower2_name,
                    follower_school2: formData.follower2_school,
                    follower_telnum2: formData.follower2_telnum,
                    follower_phonenum2: formData.follower2_phonenum,
                    prev_province: formData.militaryProvince2,
                    date_of_study: formatDateToISO(formData.Fristdata_in_U),
                },
                addresses: {
                    DOPA_address: {
                        id: id,
                        house_num: formData.domicileNumber,
                        street: formData.road,
                        soi: formData.soi,
                        house_moo: formData.moo,
                        district: formData.amphure,
                        province: formData.province,
                        postal_code: formData.zipCode,
                        subdistrict: formData.district
                    },
                    Military_address: {
                        id: id,
                        street: "",
                        district: formData.militaryDistrict,
                        province: formData.militaryProvince,
                        subdistrict: formData.militaryAmphure,
                        house_num: formData.militaryDomicileNumber,
                        house_moo: formData.militaryMoo,
                        soi: formData.militarySoi,
                        postal_code: ""
                    },
                    Father_address: {
                        id: id,
                        street: "",
                        house_num: formData.fatherhome,
                        house_moo: formData.fathermoo,
                        district: formData.fatherdistrict,
                        province: formData.fatherprovince,
                        postal_code: (formData.fatherzipcode),
                        subdistrict: formData.fathersubdistrict,

                    },
                    Mother_address: {
                        id: id,
                        street: "",
                        house_num: formData.motherhome,
                        house_moo: formData.mothermoo,
                        district: formData.motherdistrict,
                        province: formData.motherprovince,
                        postal_code: (formData.motherzipcode),
                        subdistrict: formData.mothersubdistrict,

                    },

                    Follower_address1: {
                        id: id,
                        street: "",
                        house_num: formData.follower1_housenum,
                        house_moo: formData.follower1_housemoo,
                        soi: formData.follower1_housemoo,
                        district: formData.follower1_district,
                        province: formData.follower1_province,
                        postal_code: (formData.follower1_postal_code),
                        subdistrict: formData.follower1_subdistrict,

                    },

                    Follower_address2: {
                        id: id,
                        house_num: formData.follower2_housenum,
                        street: "",
                        house_moo: formData.follower2_housemoo,
                        soi: formData.follower2_housemoo,
                        district: formData.follower2_district,
                        province: formData.follower2_province,
                        postal_code: (formData.follower2_postal_code),
                        subdistrict: formData.follower2_subdistrict,

                    },
                    Contactable_address: {
                        id: id,
                        house_num: formData.domicileNumber_contactable,
                        street: "",
                        soi: formData.soi_contactable,
                        house_moo: formData.moo_contactable,
                        district: formData.amphure_contactable,
                        province: formData.province_contactable,
                        postal_code: formData.zipCode_contactable,
                        subdistrict: formData.district_contactable,
                    }
                },
                guardian_info: {
                    id: id,
                    guardian_fname: formData.ParentName,
                    guardian_lname: formData.ParentSurname,
                    guardian_title: formData.Parenttitle,
                    guardian_occupation: formData.Parentjob,
                    guardian_age: parseInt(formData.Parentage),
                    guardian_relation: formData.Parentrelated,
                    guardian_address: formData.ParentworkAddress,
                    guardian_nationality: formData.guardian_nationality,
                },

                father_mother_info: {
                    father: {
                        id: id,
                        title: "",
                        fname: formData.fatherName,
                        lname: formData.fatherSurname,
                        working_place: formData.fatherwherejob,
                        phone_num: formData.fatherphone,
                        tel_num: formData.fatherjobTST,
                        nationality: formData.fatherNationality,
                        occupation: formData.occupationfather,
                        home_tel: formData.fatherhomeTST,

                    },
                    mother: {
                        id: id,
                        title: "",
                        fname: formData.motherName,
                        lname: formData.motherSurname,
                        working_place: formData.motherwherejob,
                        phone_num: formData.motherphone,
                        tel_num: formData.motherjobTST,
                        nationality: formData.motherNationality,
                        occupation: formData.occupationmother,
                        home_tel: formData.motherhomeTST,
                    }
                },

            })
            if (admin == 0) {
                if (int_form !== 0) {
                    await axios.post(`/api/logRd/update?id=${int_form}`, (dataforsentlog))
                    router.push(`/rordor/${int_form}/Doc2`)
                }
                else {
                    const response = await axios.post(`/api/logRd/create2`, (dataforsentlog))
                    const formId = response.data.data.id
                    console.log("generate formID", formId);
                    router.push(`/rordor/${formId}/Doc2`)
                }
            }
            if (admin == 1) {
                router.push(`/Admin/rd/0`)
            }
        } catch (error) {
            notifyerror()
            console.log(formData)
            console.error('Form submission error:', error);
            // router.push("/rordor/Doc2")
        }
    };
    const handleback = () => {
        console.log("Doc", int_form);
        if (admin == 1) {
            router.push(`/Admin/rd/0`);
            return
        }
        else { router.push(`/rordor/${int_form}`) }
    }
    return (
        <div><Header req1="รายงานตัวเข้าฝึกนักศึกษาวิชาทหาร" req2="" />
            <div className="min-h-screen bg-whites 2xl:mx-24 xl:mx-24 lg:mx-24 md:mx-24 ">

                <main className="flex justify-center items-center ">
                    <div className="bg-white p-8 w-full ">
                        <section className="ml-5">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Personal />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">คำยินยอมของ บิดา/มารดา หรือ ผู้ปกครองตามกฎหมาย (Parental consent form)</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full ">
                                        <div className="w-1/2 ">
                                            <label className="block text-gray-700 mb-2">คำนำหน้าชื่อ (Parent's name title)</label>
                                            <input
                                                type="text"
                                                name="Parenttitle"
                                                value={formData.Parenttitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Parent title"
                                            />
                                        </div>
                                        <div className="w-1/2 ">
                                            <label className="block text-gray-700 mb-2">ชื่อ (Parent's name)</label>
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
                                        <label className="block text-gray-700 mb-2">นามสกุล (Parent's surname)</label>
                                        <input
                                            type="text"
                                            name="ParentSurname"
                                            value={formData.ParentSurname}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Parent Surname"
                                        />
                                    </div>

                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อายุ (Parent's age)</label>
                                            <input
                                                type="text"
                                                name="Parentage"
                                                value={formData.Parentage}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Parent Age"
                                            />
                                        </div>
                                        <div className="w-1/2">
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
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                            <input
                                                type="text"
                                                name="guardian_nationality"
                                                value={formData.guardian_nationality}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nationality"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อาชีพ (Parent's Occupation)</label>
                                            <input
                                                type="text"
                                                name="Parentjob"
                                                value={formData.Parentjob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Occupation"
                                            />
                                        </div>

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
                                            <label className="block text-gray-700 mb-2">อาชีพ (Occupation)</label>
                                            <input
                                                type="text"
                                                name="fatherjob"
                                                value={formData.fatherjob}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Occupation"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work address)</label>
                                        <input
                                            type="text"
                                            name="fatherwherejob"
                                            value={formData.fatherwherejob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Work address"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                            <input
                                                type="text"
                                                name="fatherjobTST"
                                                value={formData.fatherjobTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                                            <input
                                                type="text"
                                                name="fatherphone"
                                                value={formData.fatherphone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Mobile number"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ที่อยู่ปัจจุบัน บ้านเลขที่ (Address number)</label>
                                            <input
                                                type="text"
                                                name="fatherhome"
                                                value={formData.fatherhome}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Address number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                            <input
                                                type="text"
                                                name="fathermoo"
                                                value={formData.fathermoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo"
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
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
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
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="fathersubdistrict"
                                            value={formData.fathersubdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="fatherzipcode"
                                            value={formData.fatherzipcode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                        <input
                                            type="text"
                                            name="fatherhomeTST"
                                            value={formData.fatherhomeTST}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>


                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ข้อมูลมารดา (Mother's information)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ชื่อมารดา (Mother's name)</label>
                                            <input
                                                type="text"
                                                name="motherName"
                                                value={formData.motherName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="mother's name"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">นามสกุลบิดา (Mother's surname)</label>
                                            <input
                                                type="text"
                                                name="motherSurname"
                                                value={formData.motherSurname}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="mother's surname"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">สัญชาติ (Nationality)</label>
                                            <input
                                                type="text"
                                                name="motherNationality"
                                                value={formData.motherNationality}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Nationality"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">อาชีพ (Occupation)</label>
                                            <input
                                                type="text"
                                                name="motherjob"
                                                value={formData.occupationmother}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Occupation"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">ที่อยู่ที่ทำงาน (Work Address)</label>
                                        <input
                                            type="text"
                                            name="motherwherejob"
                                            value={formData.motherwherejob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Work Address"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                            <input
                                                type="text"
                                                name="motherjobTST"
                                                value={formData.motherjobTST}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                                            <input
                                                type="text"
                                                name="motherphone"
                                                value={formData.motherphone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Mobile number"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ที่อยู่ปัจจุบัน บ้านเลขที่ (Address number)</label>
                                            <input
                                                type="text"
                                                name="motherhome"
                                                value={formData.motherhome}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Address number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                            <input
                                                type="text"
                                                name="mothermoo"
                                                value={formData.mothermoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo"
                                            />
                                        </div>

                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="motherprovince"
                                            value={formData.motherprovince}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.motherprovince}>{formData.motherprovince}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="motherdistrict"
                                            value={formData.motherdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.motherdistrict}>{formData.motherdistrict}</option>
                                            {amphuresmother.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="mothersubdistrict"
                                            value={formData.mothersubdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="motherzipcode"
                                            value={formData.motherzipcode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                        <input
                                            type="text"
                                            name="motherhomeTST"
                                            value={formData.motherhomeTST}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ประวัติการศึกษา (Academin record)
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
                                                        value={formData[`RD2_Grade${i + 1}`] || ''}
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
                                                        value={formData[`RD2_Level${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Level"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">คณะ/วิชาเอก (Faculty)</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_Major1"
                                                        value={formData[`RD2_Major${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Faculty"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <div className="flex space-x-4 w-full">
                                                        <div className="w-11/12">
                                                            <label className="block text-gray-700 mb-2">สถานศึกษา (Educational institution)</label>
                                                            <input
                                                                type="text"
                                                                name="RD2_Academy1"
                                                                value={formData[`RD2_Academy${i + 1}`] || ''}
                                                                onChange={(e) => handleinputchange(e, i)}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                                placeholder="จุฬาลงกรณ์"
                                                                disable="true"

                                                            />
                                                        </div>


                                                        <div className="w-1/12">
                                                            {inputlist_education.length > 1 && (
                                                                <button
                                                                    className="w-full py-1 bg-gray-400 text-white font-semibold rounded-lg shadow-md"
                                                                    onClick={(e) => handledeleteclick(e, i)}
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
                                {
                                    inputlist_training.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">ชั้นปีที่ (Year Level)</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_LevelRD1"
                                                        value={formData[`RD2_LevelRD${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange_training(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Level"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">/</label>
                                                    <input
                                                        type="text"
                                                        name="RD2_LevelRD12"
                                                        value={formData[`RD2_LevelRD${i + 1}2`] || ''}
                                                        onChange={(e) => handleinputchange_training(e, i)}
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
                                                        value={formData[`RD2_AcademyRD${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange_training(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Educational institution"
                                                    />
                                                </div>
                                                <div className="flex space-x-4 w-1/2">
                                                    <div className="w-11/12">
                                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                                        <select
                                                            name="RD2_ProvinceRD1"
                                                            value={formData[`RD2_ProvinceRD${i + 1}`] || ''}
                                                            onChange={(e) => handleinputchange_training(e, i)}
                                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        >
                                                            <option value="">{formData[`RD2_ProvinceRD${i + 1}`] || 'Select Province'}</option>
                                                            {provinces.map((item, index) => (
                                                                <option key={index} value={item.name_th}>
                                                                    {item.name_th}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="w-1/12">
                                                        {inputlist_training.length > 1 && (
                                                            <button
                                                                className="w-full py-1 bg-gray-400 text-white font-semibold rounded-lg shadow-md"
                                                                onClick={(e) => handledeleteclick_training(e, i)}
                                                            >
                                                                -
                                                            </button>
                                                        )}
                                                        {inputlist_training.length - 1 === i && inputlist_training.length <= 3 && (
                                                            <button
                                                                className="py-2 w-full bg-green-400 text-white font-semibold rounded-lg shadow-md"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleaddclick_training();
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 py-10 ">
                                        ภูมิลำเนาทหาร *กรณีขึ้นทะเบียนทหารกองเกินแล้ว(Military domicile *In case of already registered for military conscription)
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขที่ (Address number)</label>
                                        <input
                                            type="text"
                                            name="militaryDomicileNumber"
                                            value={formData.militaryDomicileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Address Number"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                            <input
                                                type="text"
                                                name="militaryMoo"
                                                value={formData.militaryMoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ซอย (Soi)</label>
                                            <input
                                                type="text"
                                                name="militarySoi"
                                                value={formData.militarySoi}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Soi"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
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
                                            <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
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
                                            <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
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
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4  pt-10">
                                        การเป็นทหารกองหนุน (Being a military reservist)
                                    </h3>
                                </div>
                                <h3 className="pl-8 pb-8 text-lg pt-4">ได้ขึ้นทะเบียนกองประจําการและนําปลดเป็นทหารกองหนุน (Registered for active duty and discharged to become a military reservist.)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div >
                                        <label className="block text-gray-700 mb-2">เหล่าทัพ (Army corps)</label>
                                        <input
                                            type="text"
                                            name="Branches"
                                            value={formData.Branches}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Branches of the military"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เหล่า (Corps)</label>
                                        <input
                                            type="text"
                                            name="corps"
                                            value={formData.corps}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="corps"
                                        />
                                    </div>
                                </div>
                                <h3 className="pl-8 pb-8 text-lg pt-10">ได้รับการแต่งตั้งยศ</h3>
                                {
                                    inputlist_role.map((item, i) => (
                                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">ยศ (Rank)</label>
                                                    <input
                                                        type="text"
                                                        name="military_rank1"
                                                        value={formData[`military_rank${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange_role(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Rank"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">เหล่า (Corps)</label>
                                                    <input
                                                        type="text"
                                                        name="corps_rank1"
                                                        value={formData[`corps_rank${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange_role(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Corps"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex space-x-4 w-full">
                                                <div className="w-1/2">
                                                    <label className="block text-gray-700 mb-2">เลขที่คำสั่ง (Order number)</label>
                                                    <input
                                                        type="text"
                                                        name="command_rank1"
                                                        value={formData[`command_rank${i + 1}`] || ''}
                                                        onChange={(e) => handleinputchange_role(e, i)}
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                        placeholder="Command"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <div className="flex space-x-4 w-full">
                                                        <div className="w-11/12">
                                                            <label className="block text-gray-700 mb-2">ลงวันที่ (Date)</label>
                                                            <input
                                                                type="date"
                                                                name="date_rank1"
                                                                value={formData[`date_rank${i + 1}`] || ''}
                                                                onChange={(e) => handleinputchange_role(e, i)}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                            />
                                                        </div>
                                                        <div className="w-1/12">
                                                            {inputlist_role.length > 1 && (
                                                                <button
                                                                    className="w-full py-1 bg-gray-400 text-white font-semibold rounded-lg shadow-md"
                                                                    onClick={(e) => handledeleteclick_role(e, i)}
                                                                >
                                                                    -
                                                                </button>
                                                            )}
                                                            {inputlist_role.length - 1 === i && inputlist_role.length < 2 && (
                                                                <button
                                                                    className="py-2 w-full bg-green-400 text-white font-semibold rounded-lg shadow-md"
                                                                    onClick={handleaddclick_role}
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
                                        ที่อยู่ที่ติดต่อได้สะดวก หรือ ที่อยู่ปัจจุบัน (Current address or convenient contact address)
                                    </h3>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">เลขที่ (Address number)</label>
                                        <input
                                            type="text"
                                            name="domicileNumber_contactable"
                                            value={formData.domicileNumber_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Address Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                        <input
                                            type="text"
                                            name="moo_contactable"
                                            value={formData.moo_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Moo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">ซอย (Soi)</label>
                                        <input
                                            type="text"
                                            name="soi_contactable"
                                            value={formData.soi_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Soi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="province_contactable"
                                            value={formData.province_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.province_contactable}>{formData.province_contactable}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="amphure_contactable"
                                            value={formData.amphure_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.amphure_contactable}>{formData.amphure_contactable}</option>
                                            {amphures_contactable.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="district_contactable"
                                            value={formData.district_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="zipCode_contactable"
                                            value={formData.zipCode_contactable}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>

                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 pt-10 ">
                                        บุคคลที่ใกล้ชิดสามารถติดตามได้ (Contact person)
                                    </h3>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="text-lg font-semibold mb-4 pt-10 " >1.</div>
                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">ชื่อ นามสกุล(Fullname)</label>
                                            <input
                                                type="text"
                                                name="follower1_name"
                                                value={formData.follower1_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Fullname"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">สถานศึกษา (School)</label>
                                        <input
                                            type="text"
                                            name="follower1_school"
                                            value={formData.follower1_school}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="School"
                                        />
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">บ้านเลขที่ (House number)</label>
                                        <input
                                            type="text"
                                            name="follower1_housenum"
                                            value={formData.follower1_housenum}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="House"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                            <input
                                                type="text"
                                                name="follower1_housemoo"
                                                value={formData.follower1_housemoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ตรอก/ซอย (Soi)</label>
                                            <input
                                                type="text"
                                                name="follower1_soi"
                                                value={formData.follower1_soi}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Soi"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="follower1_province"
                                            value={formData.follower1_province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.follower1_province}>{formData.follower1_province}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="follower1_district"
                                            value={formData.follower1_district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.follower1_district}>{formData.follower1_district}</option>
                                            {amphuresfollower1.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="follower1_subdistrict"
                                            value={formData.follower1_subdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="follower1_postal_code"
                                            value={formData.follower1_postal_code}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>


                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                            <input
                                                type="text"
                                                name="follower1_telnum"
                                                value={formData.follower1_telnum}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                                            <input
                                                type="text"
                                                name="follower1_phonenum"
                                                value={formData.follower1_phonenum}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Mobile number"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 py-4">
                                    <div className="flex space-x-4 w-full">
                                        <div className="text-lg font-semibold mb-4 pt-10 " >2.</div>
                                        <div className="w-full">
                                            <label className="block text-gray-700 mb-2">ชื่อ นามสกุล(Name surname)</label>
                                            <input
                                                type="text"
                                                name="follower2_name"
                                                value={formData.follower2_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Name surname"
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">สถานศึกษา (School)</label>
                                        <input
                                            type="text"
                                            name="follower2_school"
                                            value={formData.follower2_school}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="School"
                                        />
                                    </div>
                                    <div >
                                        <label className="block text-gray-700 mb-2">บ้านเลขที่ (House number)</label>
                                        <input
                                            type="text"
                                            name="follower2_housenum"
                                            value={formData.follower2_housenum}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="House"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">หมู่ที่ (Moo)</label>
                                            <input
                                                type="text"
                                                name="follower2_housemoo"
                                                value={formData.follower2_housemoo}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Moo"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">ตรอก/ซอย (Soi)</label>
                                            <input
                                                type="text"
                                                name="follower2_soi"
                                                value={formData.follower2_soi}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Soi"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">จังหวัด (Province)</label>
                                        <select
                                            name="follower2_province"
                                            value={formData.follower2_province}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.follower2_province}>{formData.follower2_province}</option>
                                            {provinces.map((item, index) => (
                                                <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">เขต/อำเภอ (District)</label>
                                        <select
                                            name="follower2_district"
                                            value={formData.follower2_district}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        >
                                            <option value={formData.follower2_district}>{formData.follower2_district}</option>
                                            {amphuresfollower2.map((amphure, index) => (
                                                <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">แขวง/ตำบล (Subdistrict)</label>
                                        <input
                                            type="text"
                                            name="follower2_subdistrict"
                                            value={formData.follower2_subdistrict}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Subdistrict"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">รหัสไปรษณีย์ (Zip code)</label>
                                        <input
                                            type="text"
                                            name="follower2_postal_code"
                                            value={formData.follower2_postal_code}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            placeholder="Zip code"
                                        />
                                    </div>
                                    <div className="flex space-x-4 w-full">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">โทรศัพท์ ทศท (Phone number)</label>
                                            <input
                                                type="text"
                                                name="follower2_telnum"
                                                value={formData.follower2_telnum}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 mb-2">มือถือ (Mobile number)</label>
                                            <input
                                                type="text"
                                                name="follower2_phonenum"
                                                value={formData.follower2_phonenum}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Mobile number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {admin == 0 && (
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
                                            หน้าถัดไป
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
                </main >
            </div >
        </div >
    );
};
export default CheckData;