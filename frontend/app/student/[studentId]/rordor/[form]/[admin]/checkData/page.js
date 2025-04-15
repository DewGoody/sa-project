// pages/rordor/checkData.js
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../../../../../components/Header';
import { useFormData } from '../../../../../../contexts/RDDataContext'; // Adjust the import path as necessary
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { Parent } from '../component/parent';
import { Personal } from '../component/personal';
import 'react-toastify/dist/ReactToastify.css';



const notifyerror = () => {
    toast.error('👆🏻 กรอกข้อมูลไม่ครบถ้วน', {
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
    const { studentId } = useParams();
    const { updateDataid } = useFormData()
    const router = useRouter();
    const { form } = useParams()
    const { admin } = useParams()
    const int_form = parseInt(form)
    useEffect(() => {
        if (form) {
            console.log("เลขform", int_form)
            updateDataid({ int_form })
        }
    }, [form, updateDataid])


    const handleback = () => {
        // router.push(`/rordor/${int_form}`);
        console.log("Button clicked, int_form value:", int_form);
        if (admin == "0") {
            console.log("in if");
            // if (!int_form || isNaN(int_form)) {
            //     console.error("Invalid int_form value:", int_form);
            //     return;
            // }
            router.push(`/student/${studentId}/rordor/${int_form}`);
            return
        }
        if (admin == "1") {
            router.push(`/Admin/rd/0`);
            return
        }
    };


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        console.log(`[DEBUG] ${name} changed:`, type === 'checkbox' ? checked : value);
        updateFormData({
            [name]: type === 'checkbox' ? checked : value
        });
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("ทดสอบ formData.Parentconsent1", formData.Parentconsent1);

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
                year: formData.year || '',
                thai_id: formData.citizenId,
                bd: formatDateToISO(formData.birthDate),
                religion: formData.religion,
                race: formData.ethnicity,
                nationality: formData.nationality,
                degree: formData.degree,
                phone_num: formData.phone_num,
            })


            const tttsd = await axios.put(`/api/military?id=${int_form}`, {
                student: {
                    id: id,
                    fnameTH: formData.Name,
                    lnameTH: formData.Surname,
                    fnameEN: formData.fnameEN || "",
                    lnameEN: formData.lnameEN || "",
                    title: formData.Nametitle,
                    year: formData.year || '',
                    thai_id: formData.citizenId,
                    bd: formatDateToISO(formData.birthDate),
                    religion: formData.religion,
                    race: formData.ethnicity,
                    nationality: formData.nationality,
                },
                rD_info: {
                    student_id: id,
                    RD_type: 1,
                    registermyself: formData.registermyself,
                    notmilitary: formData.notmilitary,
                    man_right: formData.man_right,
                    women_right: formData.women_right,
                    ready_right: formData.ready_right,
                },
                guardian_info: {
                    id: id,
                    guardian_fname: formData.ParentName,
                    guardian_lname: formData.ParentSurname,
                    guardian_title: formData.Parenttitle,
                    guardian_relation: formData.Parentrelated,
                    phone_num: parseInt(formData.ParentPhone),
                    consent1: formData.Parentconsent1,
                    consent2: formData.Parentconsent2,
                },
                father_mother_info: {
                    father: {
                        id: id,
                        relation: "father",
                        title: formData.fathertitle,
                        fname: formData.fatherName,
                        lname: formData.fatherSurname,
                        phone_num: formData.fatherphone
                    },
                    mother: {
                        id: id,
                        relation: "mother",
                        title: formData.mothertitle,
                        fname: formData.motherName,
                        lname: formData.motherSurname,
                        phone_num: formData.motherphone
                    }
                },
            });
            notifysuccess()

            if (admin == 0) {
                console.log("int_form", int_form);

                if (int_form !== 0) {
                    router.push(`/student/${studentId}/rordor/${int_form}/Doc`)
                }
                else {
                    const response = await axios.post(`/api/request/create`, { type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร", status: "รอจองคิว", stuId: id, formId: tttsd.data.id });
                    const formId = response.data.data.id
                    console.log("generate formID", formId);
                    router.push(`/student/${studentId}/rordor/${formId}/Doc`)
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
                                <div>
                                    <Personal />
                                    <div className='flex space-x-4 w-full'>
                                        <div className='w-1/3'>
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
                                        <div className='w-1/3'>
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
                                        <div className='w-1/3'>
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
                                </div>
                                <div>
                                    <Parent />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                        คำรับรองและคำยินยอมของผู้รายงานตัว (Declaration and consent of the reporter)
                                    </h3>
                                </div>
                                <div className='flex space-x-4 w-full pb-2'>
                                    <div className="flex items-center space-x-4 w-1/2">
                                        <input
                                            type="checkbox"
                                            id="registermyself"
                                            name="registermyself"
                                            onChange={handleChange}
                                            checked={formData.registermyself}
                                        />
                                        <label htmlFor="registermyself" className="block text-gray-700">
                                            สมัครใจเข้ารับการฝึกวิชาทหาร (Voluntary enlistment for military training)
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-4 w-1/2">
                                        <input
                                            type="checkbox"
                                            id="notmilitary"
                                            name="notmilitary"
                                            onChange={handleChange}
                                            checked={formData.notmilitary}
                                        />
                                        <label htmlFor="notmilitary" className="block text-gray-700">
                                            ไม่เป็นทหารประจำการ กองประจำการ หรือถูกกำหนดตัวเข้ากองประจำการ (Not being a regular soldier, active duty or being assigned to active duty)
                                        </label>
                                    </div>
                                </div>
                                <div className='flex space-x-4 w-full pt-2'>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="man_right"
                                            name="man_right"
                                            onChange={handleChange}
                                            checked={formData.man_right}
                                        />
                                        <label htmlFor="man_right" className="block text-gray-700">
                                            ชาย ไว้ทรงผมรองทรงสูง ความยาวด้านบนไม่เกิน ๕ ซม. หรือสั้นกว่า (Men have a high crew cut hairstyle with the top length not exceeding 5 cm. or shorter.)
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="women_right"
                                            name="women_right"
                                            onChange={handleChange}
                                            checked={formData.women_right}
                                        />
                                        <label htmlFor="women_right" className="block text-gray-700">
                                            หญิง ไว้ทรงผมตามที่ระเบียบกำหนด (Women must have their hair style as prescribed by the regulations.)
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-4 w-1/3">
                                        <input
                                            type="checkbox"
                                            id="ready_right"
                                            name="ready_right"
                                            onChange={handleChange}
                                            checked={formData.ready_right}
                                        />
                                        <label htmlFor="ready_right" className="block text-gray-700">
                                            พร้อมปฏิบัติตามเงื่อนไขบังคับในการสมัครเป็น นศท.ทุกประการ (Ready to comply with all the mandatory conditions for applying for ROTC.)
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                        คำยินยอมของบิดา มารดา หรือผู้ปกครอง (Consent of father, mother or guardian)
                                    </h3>
                                </div>
                                <div className='flex space-x-4 w-full pb-2'>
                                    <div className="flex items-center space-x-4 w-1/2 ">
                                        <input
                                            type="checkbox"
                                            id="Parentconsent1"
                                            name="Parentconsent1"
                                            checked={formData.Parentconsent1}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="Parentconsent1" className="block text-gray-700">
                                            ให้ผู้สมัคร สมัครเป็น นศท.ชั้นปีที่ 1 ในปีการศึกษานี้ (Allow the applicant to enroll as a first-year ROTC student in this academic year)
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-4 w-1/2 ">
                                        <input
                                            type="checkbox"
                                            id="Parentconsent2"
                                            name="Parentconsent2"
                                            checked={formData.Parentconsent2}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="Parentconsent2" className="block text-gray-700">
                                            ให้ผู้สมัคร ทดสอบสมรรถภาพร่างกาย เพื่อเป็น นศท. และฝึกวิชาทหาร เมื่อได้รับการคัดเลือก (Allow the applicant to test physical fitness to be a ROTC and military training when selected)
                                        </label>

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
                </main>
            </div >
        </div >
    );
};

export default CheckData;