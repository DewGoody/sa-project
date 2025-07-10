"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";
import { Header } from "../../../../components/Header.js";
import numberToThaiText from "../../../../components/numberToThaiText.js";
import { PatternFormat } from "react-number-format";
import { DatePicker } from 'antd';

function Page() {
  const [vendorData, setVendorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const { studentId } = useParams();
  const { form } = useParams();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "titleTH",
      "houseID",
      "moo",
      "buildingVillage",
      "soi",
      "road",
      "subDistrict",
      "district",
      "province",
      "postalCode",
      "tel",
      "citizenId",
      "citizenIssueDate",
      "citizenExpireDate",
      "claimType",
      "amount",
      "bankCompany",
      "bankBranch",
      "bankAccountType",
      "bankAccountName",
      "bankAccountNumber",
    ];
    if (vendorData.citizenId) {
      vendorData.citizenId = vendorData.citizenId.replace(/-/g, "");
    }

    for (let field of requiredFields) {
      if (!vendorData[field] || vendorData[field].trim() === "") {
        alert(`Please fill in the "${field}" field.`);
        return;
      }
    }
    if (vendorData.claimType === "อื่นๆ (ระบุ)") {
      if (!vendorData.claimOtherReason) {
        alert(`Please fill in the "Other case, please specify" field.`);
        return;
      }
    }
    if (vendorData.citizenIssueDate > vendorData.citizenExpireDate) {
      alert("Identification card issue date must be before expire date");
      return;
    }
    if (vendorData.citizenId.length !== 13) {
      alert("Identification number must be 13 digits");
      return;
    }
    if (vendorData.bankAccountNumber.length !== 10) {
      alert("Bank account number must be 10 digits");
      return;
    }
    if (vendorData.amount <= 0) {
      alert("Amount must be a positive number");
      return;
    }
    if (vendorData.amount) {
      vendorData.amount = parseFloat(vendorData.amount).toFixed(2);
    }


    console.log(vendorData);
    if (studentId !== "0") {
      if (form !== "0") {
        try {
          const response = await axios.post("/api/vendor/update", vendorData);
          console.log("update", response.data);
          const reqId = response.data.data.req_id;
          const formId = response.data.data.id;
          router.push(`/student/${studentId}/vendor/checkVendor/${formId}/${reqId}`);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await axios.post("/api/vendor/create", vendorData);
          console.log(response.data);
          const reqId = response.data.data.req_id;
          const formId = response.data.data.id;
          router.push(`/student/${studentId}/vendor/checkVendor/${formId}/${reqId}`);
        } catch (error) {
          console.error(error);
        }
      }
    }
    else {
      try {
        const response = await axios.post("/api/vendor/update", vendorData);
        console.log("update", response.data);
        const reqId = response.data.data.req_id;
        const formId = response.data.data.id;
        router.push(`/Admin/vendor/0`);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleChange = (event, field) => {
    console.log(field + " : " + event.target.value);
    setVendorData({ ...vendorData, [field]: event.target.value });
    if (field === "province") {
      const id = event.target.selectedOptions[0]?.dataset.id;
      fetchAmphuresById(id);
    }
    // Set claimOtherReason to null when claimType changes
    if (field === "claimType") {
      setVendorData({ ...vendorData, [field]: event.target.value, claimOtherReason: "" });
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
  useEffect(() => {
    fetchProvinces();

  }, []);
  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/profile"); // Example API
      console.log(response.data);
      response.data.phone_num = response.data.tel_num;
      setProfileData(response.data);
      console.log("profileData", response.data);

      // Only set profile data if form is "0" (new form)
      if (form === "0") {
        const profileVendorData = {
          titleTH: response.data.title || "",
          nameTH: response.data.fnameTH + " " + response.data.lnameTH || "",
          faculty: response.data.facultyNameTH || "",
          stu_id: response.data.id || "",
          ...response.data
        };

        setVendorData(profileVendorData);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await axios.post("/api/vendor/getDataById", {
        id: form,
      });
      console.log("getVendorData", response.data);

      // Ensure all critical fields have default values to prevent undefined
      const vendorDataWithDefaults = {
        subDistrict: "",
        district: "",
        bankAccountNumber: "",
        amount: "",
        ...response.data.data
      };

      setVendorData(vendorDataWithDefaults);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  console.log("vendorData", vendorData);

  useEffect(() => {
    const initializeData = async () => {
      if (studentId !== "0") {
        // For logged in students
        if (form !== "0") {
          // Edit existing form - fetch vendor data first, then profile for reference
          await fetchVendorData();
          await fetchProfile();
        } else {
          // New form - fetch profile data to pre-populate
          await fetchProfile();
        }
      } else {
        // For admin editing
        await fetchVendorData();
      }
    };

    initializeData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className=" bg-white min-h-screen">
        <Header
          req1="แบบคำขอรับเงินผ่านธนาคาร (Vendor)"
          req2="ผู้มีสิทธิ์รับเงินประเภทนิสิต ภายในจุฬาลงกรณ์มหาวิทยาลัย"
        />
        <div className=" mx-24 ">
          <main className="flex justify-center bg-white w-full flex-col">
            <div className="bg-white  w-full min-w-screen-6xl">
              <section className="ml-5 py-4">
                <h3 className="text-lg font-semibold my-4 flex gap-4">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    1
                  </span>
                  ข้อมูลส่วนตัว (Personal & contact information)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <div className="pt-4 md:pt-0">
                      <label className="block text-gray-700 mb-2">
                        คำนำหน้า (Title)
                      </label>
                      <input
                        type="text"
                        name="titleTH"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="คำนำหน้า (Title)"
                        onChange={(event) => handleChange(event, "titleTH")}
                        value={vendorData?.titleTH || ""}
                      />
                    </div>
                    <div className="pt-4 md:pt-0 col-span-2">
                      <label className="block text-gray-700 mb-2 break-words">
                        ชื่อและนามสกุล (Name-Surname)
                      </label>
                      <input
                        type="text"
                        name="nameTH"
                        disabled
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="ชื่อและนามสกุล (Name-Surname)"
                        value={profileData ? profileData?.fnameTH + " " + profileData?.lnameTH : vendorData?.nameTH}
                      />
                    </div>
                  </div>
                  <div className="pt-4 md:pt-0">
                    <label className="block text-gray-700 mb-2">
                      คณะ (Faculty)
                    </label>
                    <select
                      id="faculty"
                      disabled
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#f3f4f6]"
                      value={vendorData.faculty}
                    >
                      <option value="null">
                        เลือกคณะ (Choose faculty)
                      </option>
                      <option value="คณะครุศาสตร์">คณะครุศาสตร์</option>
                      <option value="คณะจิตวิทยา">คณะจิตวิทยา</option>
                      <option value="คณะทันตแพทยศาสตร์">
                        คณะทันตแพทยศาสตร์
                      </option>
                      <option value="คณะนิติศาสตร์">คณะนิติศาสตร์</option>
                      <option value="คณะนิเทศศาสตร์">คณะนิเทศศาสตร์</option>
                      <option value="คณะพยาบาลศาสตร์">คณะพยาบาลศาสตร์</option>
                      <option value="คณะพาณิชยศาสตร์และการบัญชี">
                        คณะพาณิชยศาสตร์และการบัญชี
                      </option>
                      <option value="คณะแพทยศาสตร์">คณะแพทยศาสตร์</option>
                      <option value="คณะเภสัชศาสตร์">คณะเภสัชศาสตร์</option>
                      <option value="คณะรัฐศาสตร์">คณะรัฐศาสตร์</option>
                      <option value="คณะวิทยาศาสตร์">คณะวิทยาศาสตร์</option>
                      <option value="คณะวิทยาศาสตร์การกีฬา">
                        คณะวิทยาศาสตร์การกีฬา
                      </option>
                      <option value="คณะวิศวกรรมศาสตร์">
                        คณะวิศวกรรมศาสตร์
                      </option>
                      <option value="คณะศิลปกรรมศาสตร์">
                        คณะศิลปกรรมศาสตร์
                      </option>
                      <option value="คณะเศรษฐศาสตร์">คณะเศรษฐศาสตร์</option>
                      <option value="คณะสถาปัตยกรรมศาสตร์">
                        คณะสถาปัตยกรรมศาสตร์
                      </option>
                      <option value="คณะสหเวชศาสตร์">คณะสหเวชศาสตร์</option>
                      <option value="คณะสัตวแพทยศาสตร์">
                        คณะสัตวแพทยศาสตร์
                      </option>
                      <option value="คณะอักษรศาสตร์">คณะอักษรศาสตร์</option>
                      <option value="สถาบันนวัตกรรมบูรณาการแห่งจุฬาลงกรณ์มหาวิทยาลัย">
                        สถาบันนวัตกรรมบูรณาการแห่งจุฬาลงกรณ์มหาวิทยาลัย
                      </option>
                      <option value="สำนักวิชาทรัพยากรการเกษตร">
                        สำนักวิชาทรัพยากรการเกษตร
                      </option>
                      <option value="บัณฑิตวิทยาลัย">บัณฑิตวิทยาลัย</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-4  w-full  ">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        บ้านเลขที่ (Address number)
                      </label>
                      <input
                        type="text"
                        name="houseID"
                        value={vendorData?.houseID}
                        onChange={(event) => handleChange(event, "houseID")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="บ้านเลขที่ (Address number)"
                      />
                    </div>
                    <div className="pt-4 md:pt-0">
                      <label className="block text-gray-700 mb-2">
                        หมู่ที่ (Moo)
                      </label>
                      <input
                        type="text"
                        name="moo"
                        value={vendorData?.moo}
                        onChange={(event) => handleChange(event, "moo")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="หมู่ที่ (Moo)"
                      />
                      <span className="text text-xs text-red-600 mt-2">
                        * หากไม่มีโปรดใส่ขีด (-) / If none, please enter a dash (-)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      อาคาร/หมู่บ้าน (Building/Village)
                    </label>
                    <input
                      type="text"
                      name="buildingVillage"
                      value={vendorData?.buildingVillage}
                      onChange={(event) =>
                        handleChange(event, "buildingVillage")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="อาคาร/หมู่บ้าน (Building/Village)"
                    />
                    <span className="text text-xs text-red-600 mt-2">
                      * หากไม่มีโปรดใส่ขีด (-) / If none, please enter a dash (-)
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ตรอก/ซอย (Soi)
                    </label>
                    <input
                      type="text"
                      name="soi"
                      value={vendorData?.soi}
                      onChange={(event) => handleChange(event, "soi")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ตรอก/ซอย (Soi)"
                    />
                    <span className="text text-xs text-red-600 mt-2">
                      * หากไม่มีโปรดใส่ขีด (-) / If none, please enter a dash (-)
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ถนน (Road)
                    </label>
                    <input
                      type="text"
                      name="road"
                      value={vendorData?.road}
                      onChange={(event) => handleChange(event, "road")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ถนน (Road)"
                    />
                    <span className="text text-xs text-red-600 mt-2">
                      * หากไม่มีโปรดใส่ขีด (-) / If none, please enter a dash (-)
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      จังหวัด (Province)
                    </label>
                    <select
                      name="province"
                      value={vendorData?.province}
                      onChange={(event) => handleChange(event, "province")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={vendorData?.province}>{vendorData?.province}</option>
                      {provinces.map((item, index) => (
                        <option key={index} data-id={item.id} value={item.name_th}>{item.name_th}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เขต/อำเภอ (District)
                    </label>
                    <select
                      name="district"
                      value={vendorData?.district || ""}
                      onChange={(event) => handleChange(event, "district")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">เลือกเขต/อำเภอ (Choose district)</option>
                      {vendorData?.district && (
                        <option value={vendorData.district}>{vendorData.district}</option>
                      )}
                      {amphures.map((amphure, index) => (
                        <option key={index} data-id={amphure.id} value={amphure.name_th}>{amphure.name_th}</option>
                      ))}
                    </select>

                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      แขวง/ตำบล (Sub-district)
                    </label>
                    <input
                      type="text"
                      name="subDistrict"
                      value={vendorData?.subDistrict || ""}
                      onChange={(event) => handleChange(event, "subDistrict")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="แขวง/ตำบล (Sub-district)"
                    />
                  </div>


                  <div>
                    <label className="block text-gray-700 mb-2">
                      รหัสไปรษณีย์ (Postal code)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={vendorData?.postalCode}
                      onChange={(event) => handleChange(event, "postalCode")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="รหัสไปรษณีย์ (Postal code)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      โทรศัพท์ (Telephone)
                    </label>
                    <input
                      type="text"
                      name="tel"
                      value={vendorData?.tel}
                      onChange={(event) => handleChange(event, "tel")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="โทรศัพท์ (Telephone)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เลขบัตรประชาชน (Identification number)
                    </label>
                    <PatternFormat
                      type="text"
                      name="citizenId"
                      value={vendorData?.citizenId}
                      onChange={(event) => handleChange(event, "citizenId")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      format="#############"
                      allowEmptyFormatting
                      mask="_"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      วันที่ออกบัตร (Issue date)
                    </label>
                    <DatePicker
                      type="date"
                      name="citizenIssueDate"
                      format="DD/MM/YYYY"
                      value={
                        (vendorData?.citizenIssueDate && dayjs(vendorData.citizenIssueDate)) || null
                      }
                      onChange={(date) => {
                        handleChange(
                          {
                            target: {
                              name: "citizenIssueDate",
                              value: date ? format(date, "yyyy-MM-dd") : "",
                            },
                          },
                          "citizenIssueDate"
                        );
                      }}

                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      max={new Date()?.toISOString()?.slice(0, 10)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      วันหมดอายุบัตร (Expire date)
                    </label>
                    <DatePicker
                      type="date"
                      name="citizenExpireDate"
                      format="DD/MM/YYYY"
                      value={
                        (vendorData?.citizenExpireDate && dayjs(vendorData.citizenExpireDate)) || null
                      }
                      onChange={(date) => {
                        handleChange(
                          {
                            target: {
                              name: "citizenExpireDate",
                              value: date ? format(date, "yyyy-MM-dd") : "",
                            },
                          },
                          "citizenExpireDate"
                        );
                      }}

                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      max={new Date()?.toISOString()?.slice(0, 10)}
                    />

                  </div>
                </div>
                <h3 className="text-lg font-semibold my-4 pt-4 flex gap-4">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    2
                  </span>
                  ข้อมูลการเงิน (Financial information)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="pt-4 md:pt-0">
                    <label className="block text-gray-700 mb-2">
                      ประเภทการเบิกเงิน (Claim type)
                    </label>
                    <select
                      id="claimType"
                      value={vendorData?.claimType}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={(event) => handleChange(event, "claimType")}
                    >
                      <option defaultValue value="null">
                        เลือกประเภทการเบิกเงิน (Choose claim type)
                      </option>
                      <option value="ค่าจ้างนิสิตทำงานพิเศษ">
                        ค่าจ้างนิสิตทำงานพิเศษ
                      </option>
                      <option value="ค่าเล่าเรียน">ค่าเล่าเรียน</option>
                      <option value="ค่าธรรมเนียมการศึกษา">
                        ค่าธรรมเนียมการศึกษา
                      </option>
                      <option value="เงินสมทบค่ารักษาพยาบาล">
                        เงินสมทบค่ารักษาพยาบาล
                      </option>
                      <option value="เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ">
                        เงินช่วยเหลือนิสิตรักษาต่อเนื่อง/ทุพพลภาพ
                      </option>
                      <option value="อื่นๆ (ระบุ)">อื่นๆ (ระบุ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 ">
                      กรณีอื่นๆ โปรดระบุ (Other case, please specify)
                    </label>
                    {vendorData?.claimType === "อื่นๆ (ระบุ)" ? (
                      <input
                        type="text"
                        name="claimOtherReason"
                        value={vendorData?.claimOtherReason || ""}
                        onChange={(event) =>
                          handleChange(event, "claimOtherReason")
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                        placeholder="กรณีอื่นๆ โปรดระบุ (Other case, please specify)"
                      />
                    ) : (
                      <input
                        type="text"
                        name="claimOtherReason"
                        value={vendorData?.claimOtherReason || ""}
                        disabled
                        onChange={(event) =>
                          handleChange(event, "claimOtherReason")
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                        placeholder="กรณีอื่นๆ โปรดระบุ (Other case, please specify)"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      จำนวนเงิน (Amount)
                    </label>
                    <input
                      type="text"
                      name="amount"
                      value={vendorData?.amount || ""} // Ensure value is not undefined
                      onChange={(event) => {
                        let value = event.target.value;
                        // Allow only numbers and a single decimal point
                        value = value.replace(/[^0-9.]/g, "");
                        // Ensure only one decimal point
                        const parts = value.split('.');
                        if (parts.length > 2) {
                          value = parts[0] + '.' + parts.slice(1).join('');
                        }
                        // Limit to 2 decimal places during input
                        if (parts[1] && parts[1].length > 2) {
                          value = parts[0] + '.' + parts[1].substring(0, 2);
                        }
                        handleChange({ target: { name: "amount", value: value } }, "amount");
                      }}
                      onBlur={(event) => {
                        let value = event.target.value;
                        if (value) {
                          const num = parseFloat(value);
                          if (!isNaN(num)) {
                            handleChange({ target: { name: "amount", value: num.toFixed(2) } }, "amount");
                          } else {
                            // Handle invalid number if necessary, e.g., clear it or set to "0.00"
                            handleChange({ target: { name: "amount", value: "" } }, "amount");
                          }
                        } else {
                          handleChange({ target: { name: "amount", value: "" } }, "amount");
                        }
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="จำนวนเงิน (Amount)"
                    />
                    <span className="text text-xs text-red-600 mt-2">
                      * โปรดใส่จำนวนเงินโดยไม่มีเครื่องหมาย comma (,) /
                      Please enter the amount without comma (,)
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      บัญชีของธนาคาร (Bank)
                    </label>
                    <select
                      name="bankCompany"
                      value={vendorData?.bankCompany}
                      onChange={(event) => handleChange(event, "bankCompany")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option defaultValue value="null">
                        เลือกธนาคาร (Choose Bank)
                      </option>
                      <option value="กรุงเทพ">กรุงเทพ</option>
                      <option value="กสิกรไทย">กสิกรไทย</option>
                      <option value="กรุงไทย">กรุงไทย</option>
                      <option value="ทหารไทย">ทหารไทย</option>
                      <option value="ไทยพาณิชย์">ไทยพาณิชย์</option>
                      <option value="ซิตี้แบงก์">ซิตี้แบงก์</option>
                      <option value="สแตนดาร์ดชาร์เตอร์ด">สแตนดาร์ดชาร์เตอร์ด</option>
                      <option value="ซีไอเอ็มบี ไทย">ซีไอเอ็มบี ไทย</option>
                      <option value="ยูโอบี">ยูโอบี</option>
                      <option value="กรุงศรีอยุธยา">กรุงศรีอยุธยา</option>
                      <option value="ธนชาต">ธนชาต</option>
                      <option value="เกียรตินาคินภัทร">เกียรตินาคินภัทร</option>
                      <option value="อิสลามแห่งประเทศไทย">อิสลามแห่งประเทศไทย</option>
                      <option value="แลนด์ แอนด์ เฮ้าส์">แลนด์ แอนด์ เฮ้าส์</option>
                    </select>
                    <span className="text text-xs text-red-600 mt-2">
                      * หากไม่มีธนาคารที่ท่านใช้โปรดติดต่อเจ้าหน้าที่ / If your bank is not listed, please contact the staff
                    </span>

                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      สาขา (Branch)
                    </label>
                    <input
                      type="text"
                      name="bankBranch"
                      value={vendorData?.bankBranch}
                      onChange={(event) => handleChange(event, "bankBranch")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="สาขา (Branch)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ประเภทบัญชี (Account type)
                    </label>
                    <select
                      name="bankAccountType"
                      value={vendorData?.bankAccountType}
                      onChange={(event) =>
                        handleChange(event, "bankAccountType")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option defaultValue value="null">
                        เลือกประเภทบัญชี (Choose account type)
                      </option>
                      <option value="ออมทรัพย์">ออมทรัพย์</option>
                      <option value="กระแสรายวัน">กระแสรายวัน</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ชื่อบัญชี (Account name)
                    </label>
                    <input
                      type="text"
                      name="bankAccountName"
                      value={vendorData?.bankAccountName}
                      onChange={(event) =>
                        handleChange(event, "bankAccountName")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ชื่อบัญชี (Account name)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เลขที่บัญชี (Account number)
                    </label>
                    <input
                      type="text" // Changed from "text" to allow for custom filtering
                      name="bankAccountNumber"
                      value={vendorData?.bankAccountNumber || ""} // Ensure value is not undefined
                      onChange={(event) => {
                        const numericValue = event.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                        handleChange({ target: { name: "bankAccountNumber", value: numericValue } }, "bankAccountNumber");
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="เลขที่บัญชี (Account number)"
                      maxLength={10} // Limit to 10 digits
                    />
                    <span className="text text-xs text-red-600 mt-2">
                      * โปรดใส่เลขที่บัญชีโดยไม่มีเครื่องหมายขีด (-) / Please enter the account number without dashes (-)
                    </span>
                    <br></br>
                    <span className="text text-xs text-red-600 mt-2">
                      ** ระบบรับเลขที่บัญชีที่มี 10 หลักเท่านั้น หากบัญชีของท่านมีเลขที่บัญชีมากกว่า 10 หลัก โปรดติดต่อเจ้าหน้าที่
                    </span>
                    <br></br>
                    <span className="text text-xs text-red-600 mt-2">
                      The system accepts account numbers with only 10 digits.
                      If your account has more than 10 digits, please contact the staff
                    </span>

                  </div>
                </div>
              </section>
            </div>
            <div>
              <div className="flex justify-between mt-8">
                <a
                  onClick={() => {
                    if (studentId != '0') {
                      router.push(`/student/${studentId}/home`);
                    } else
                      router.push(`/Admin/vendor/0`);
                  }}
                >
                  <button className="bg-gray-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11">
                    Back
                  </button>
                </a>

                <button
                  onClick={handleSubmit}
                  className="bg-pink-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                >
                  {studentId != '0' ? "Next" : "Save"}

                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Page;
