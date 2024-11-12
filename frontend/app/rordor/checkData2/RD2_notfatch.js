'use client';

import { useFormData } from '../../contexts/FormDataContext';

export const Personal = () => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    }
    const { formData, updateFormData } = useFormData();
    return <>
        <h3 className="text-lg font-semibold mb-4 ">
            ข้อมูลส่วนตัวและภูมิลำเนา (Personal & contact information)
        </h3>
        <div div className="grid grid-cols-1 md:grid-cols-2 gap-4 " >
            <div className="flex space-x-4 w-full  ">
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
                <div className="w-1/2">
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
            </div>

            <div>
                <label className="block text-gray-700 mb-2">อายุ (Old)</label>
                <input
                    type="text"
                    name="OldRD"
                    value={formData.OldRD}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Old"
                />
            </div>


            <div>
                <label className="block text-gray-700 mb-2">เลขประจำตัว นศท (Reserve officer training corps student ID)</label>
                <input
                    type="text"
                    name="citizenRD"
                    value={formData.citizenRD}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ror dor citizen"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-2">เลขบัตรประชาชน (Citizen ID)</label>
                <input
                    type="text"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Citizen ID"
                />
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-4 py-10 ">
                สถานศึกษาปัจจุบัน (Current educational institution)
            </h3>
        </div>
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">ชั้นปี (Collage year)</label>
                    <input
                        type="text"
                        name="Collage_Year"
                        value={formData.Collage_Year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Collage Year"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">ระดับ (Degrees)</label>
                    <input
                        type="text"
                        name="Degrees"
                        value={formData.Degrees}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Degrees"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">แผนก/คณะ (Major)</label>
                    <input
                        type="text"
                        name="Major"
                        value={formData.Major}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Major"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">เข้าศึกษาในสถานศึกษาแห่งนี้วันที่ (Date of admission to this institution)</label>
                    <input
                        type="date"
                        name="Fristdata_in_U"
                        value={formData.Fristdata_in_U}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Date"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 py-10 ">
                    ขอรายงานตัวเข้าฝึกวชิาทหาร (Request to report for military training)
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex space-x-4 w-full  ">

                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">ชั้นปี (Year level)</label>
                        <select
                            name="Year Level"
                            value={formData.YearGradeRD}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="" disabled>Select year level</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>

                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-2">ประจำปีการศึกษา (Academic year)</label>
                        <input
                            type="text"
                            name="Yearregister"
                            value={formData.Yearregister}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Domicile Number"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">ประเภทรายงานตัว (Type of reporting)</label>
                    <select
                        name="Year Level"
                        value={formData.Yearregister}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="" disabled>Select type of reporting</option>
                        <option value="เลื่อนชั้น">เลื่อนชั้น (Promotion to the next year)</option>
                        <option value="ซ้ำชั้น">ซ้ำชั้น (Repeating the year)</option>
                        <option value="รอรับสิทธิ">รอรับสิทธิ (Awaiting eligibility)</option>
                        <option value="โอนย้ายสถานศึกษาวิชาทหาร">โอนย้ายสถานศึกษาวิชาทหาร (Transfer of military training school)</option>
                    </select>
                </div>
            </div>


        </div >
    </>
}