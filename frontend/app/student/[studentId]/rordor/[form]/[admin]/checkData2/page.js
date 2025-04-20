
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../../../../../../components/Header';
import { useFormData } from '../../../../../../contexts/RDDataContext';
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Parent } from '../component/parent';
import { Personal } from '../component/personal';
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

    const { updateDataid } = useFormData()
    const { form } = useParams()
    const { admin } = useParams()
    const { studentId } = useParams()
    const int_form = parseInt(form)
    useEffect(() => {
        if (form) {
            console.log("เลขform", int_form)
            updateDataid({ int_form })
        }
    }, [form, updateDataid])

    const { formData, updateFormData } = useFormData();
    const router = useRouter();

    useEffect(() => {
        console.log(formData)
    }, [formData])

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
    function parseDateString(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return { year, month, day };
    }
    const id = formData.id
    console.log("dadshkfjshfkjashfkashfjkadshfjkashkd", formData.RD2_Grade1);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData)
        const id = formData.id

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
                    registermyself: formData.registermyself,
                    notmilitary: formData.notmilitary,
                    readymilitary: formData.readymilitary,
                    citizenRD: parseInt(formData.citizenRD),
                    YearGradeRD: parseInt(formData.YearGradeRD),
                    register_type: parseInt(formData.register_type),
                    RD_type: parseInt(formData.YearGradeRD),
                    Branches: formData.Branches,
                    corps: formData.corps || "",
                    man_right: formData.man_right || "",
                    women_right: formData.women_right,
                },
                guardian_info: {
                    id: id,
                    guardian_fname: formData.ParentName,
                    guardian_lname: formData.ParentSurname,
                    guardian_title: formData.Parenttitle,
                    guardian_relation: formData.Parentrelated,
                    phone_num: parseInt(formData.ParentPhone),
                    consent21: formData.Parentconsent21,
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
            })
            if (admin == 0) {
                if (int_form !== 0) {
                    router.push(`/student/${studentId}/rordor/${int_form}/Doc2`)
                }
                else {
                    const response = await axios.post(`/api/request/create`, { type: "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร", status: "รอจองคิว", stuId: id, formId: tttsd.data.id });
                    const formId = response.data.data.id
                    console.log("generate formID", formId);
                    router.push(`/student/${studentId}/rordor/${formId}/Doc2`)
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
        else { router.push(`/student/${studentId}/rordor/${int_form}`) }
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">เลขประจำตัว นศท (Reserve officer training corps student ID)</label>
                                            <input
                                                type="text"
                                                name="citizenRD"
                                                value={formData.citizenRD}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder="Reserve officer training corps student ID"
                                            />
                                        </div>
                                        <diV className="flex space-x-4 w-full">
                                            <div className="w-1/2 ">
                                                <label className="block text-gray-700 mb-2">ชั้นปี (Year level)</label>
                                                <select
                                                    name="YearGradeRD"
                                                    value={formData.YearGradeRD}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                >
                                                    <option value="" >Select year level</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                            </div>
                                            <div className='w-1/2'>
                                                <label className="block text-gray-700 mb-2">ประเภทรายงานตัว (Type of requeue)</label>
                                                <select
                                                    name="register_type"
                                                    value={formData.register_type}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                >
                                                    <option value="" disabled>Select type of reporting</option>
                                                    <option value="1">เลื่อนชั้น (Promotion)</option>
                                                    <option value="2">ซ้ำชั้น (Repeat)</option>
                                                    <option value="3">รอรับสิทธิ (Postporement)</option>
                                                    <option value="4">โอนย้ายสถานศึกษาวิชาทหาร (Transfer)</option>
                                                    <option value="5">ผ่อนผันการฝึกภาคสนาม (Deferral)</option>
                                                </select>
                                            </div>
                                        </diV>
                                    </div>
                                    <h3 className="pl-8 pb-4 text-lg pt-8 ">ได้ขึ้นทะเบียนกองประจําการและนําปลดเป็นทหารกองหนุน (Registered for active duty and discharged to become a military reservist.)</h3>
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
                                </div>
                                <div>
                                    <Parent />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                        คำรับรองและคำยินยอมของผู้รายงานตัว (Declaration and consent of the reporter)
                                    </h3>
                                </div>
                                <div className='flex flex-col space-y-4 w-full pb-2'>
                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="registermyself"
                                            name="registermyself"
                                            onChange={handleChange}
                                            checked={formData.registermyself}
                                        />
                                        <label htmlFor="registermyself" className="text-gray-700">
                                            สมัครใจเข้ารับการฝึกวิชาทหาร (Voluntary enlistment for military training)
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="notmilitary"
                                            name="notmilitary"
                                            onChange={handleChange}
                                            checked={formData.notmilitary}
                                        />
                                        <label htmlFor="notmilitary" className="text-gray-700">
                                            ไม่เป็นทหารประจำการ กองประจำการ หรือถูกกำหนดตัวเข้ากองประจำการ (Not being a regular soldier, active duty or being assigned to active duty)
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="readymilitary"
                                            name="readymilitary"
                                            onChange={handleChange}
                                            checked={formData.readymilitary}
                                        />
                                        <label htmlFor="readymilitary" className="text-gray-700">
                                            พร้อมปฏิบัติตามเงื่อนไขบังคับในการรายงานตัวเข้าฝึกวิชาทหารทุกประการ (Ready to comply with all the mandatory conditions for reporting for military training)
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="man_right"
                                            name="man_right"
                                            onChange={handleChange}
                                            checked={formData.man_right}
                                            disabled

                                        />
                                        <label htmlFor="man_right" className="text-gray-700">
                                            ชาย ชั้นปีที่ ๒ - ๓ ไว้ทรงผมรองทรงสูง ความยาวด้านบนไม่เกิน ๕ ซม.หรือสั้นกว่า ชาย ชั้นปีที่ ๔ - ๕ ไว้ทรงผมรองทรง ความยาวด้านบนไม่เกิน๗ ซม. หรือสั้นกว่า (Males in Year 2-3 wear a high crew cut hairstyle with the top length not exceeding 5 cm. or shorter. Males in Year 4-5 wear a crew cut hairstyle with the top length not exceeding 7 cm. or shorter.)
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="women_right"
                                            name="women_right"
                                            onChange={handleChange}
                                            checked={formData.women_right}
                                            disabled
                                        />
                                        <label htmlFor="women_right" className="text-gray-700">
                                            หญิง ไว้ทรงผมตามที่ระเบียบกำหนด (Women must have their hair style as prescribed by the regulations.)
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4 pt-10 pb-2 ">
                                        คำยินยอมของบิดา มารดา หรือผู้ปกครอง (Consent of father, mother or guardian)
                                    </h3>
                                </div>
                                <div className='flex space-x-4 w-full pb-2'>
                                    <div className="flex items-center space-x-4 ">
                                        <input
                                            type="checkbox"
                                            id="Parentconsent21"
                                            name="Parentconsent21"
                                            checked={formData.Parentconsent21}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="Parentconsent21" className="block text-gray-700">
                                            ให้ผู้รายงานตัว รายงานตัว และฝึกวิชาทหารในปีการศึกษานี้ (Allow the reporter to report and train in this academic year)
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
                </main >
            </div >
        </div >
    );
};
export default CheckData;