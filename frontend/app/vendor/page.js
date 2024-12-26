"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header.js";
import numberToThaiText from "../components/numberToThaiText.js";

function Page() {
  const [vendorData, setVendorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  function handleSubmit(event, key) {}

  const handleChange = (event, field) => {
    console.log(field + " : " + event.target.value);
    setVendorData({ ...vendorData, [field]: event.target.value });
  };
  return (
    <>
      <div className=" bg-white min-h-screen">
        <Header
          req1="แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย (Vendor)"
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
                  <div className="pt-4 md:pt-0">
                    <label className="block text-gray-700 mb-2">
                      ชื่อและนามสกุล (Name-Surname)
                    </label>
                    <input
                      type="text"
                      name="nameTH"
                      onChange={(event) => handleChange(event, "nameTH")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ชื่อและนามสกุล (Name-Surname)"
                      defaultValue={"test"}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 ">
                      คณะ (Faculty)
                    </label>
                    <input
                      type="text"
                      name="faculty"
                      onChange={(event) => handleChange(event, "faculty")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="คณะ (Faculty)"
                      defaultValue={"test"}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-4  w-full  ">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        บ้านเลขที่ (House No.)
                      </label>
                      <input
                        type="text"
                        name="houseID"
                        onChange={(event) => handleChange(event, "houseID")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="บ้านเลขที่ (House No.)"
                      />
                    </div>
                    <div className="pt-4 md:pt-0">
                      <label className="block text-gray-700 mb-2">
                        หมู่ที่ (Moo)
                      </label>
                      <input
                        type="text"
                        name="moo"
                        onChange={(event) => handleChange(event, "moo")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="หมู่ที่ (Moo)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      อาคาร/หมู่บ้าน (Building/Village)
                    </label>
                    <input
                      type="text"
                      name="buildingVillage"
                      onChange={(event) =>
                        handleChange(event, "buildingVillage")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="อาคาร/หมู่บ้าน (Building/Village)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ตรอก/ซอย (Soi)
                    </label>
                    <input
                      type="text"
                      name="soi"
                      onChange={(event) => handleChange(event, "soi")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ตรอก/ซอย (Soi)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ถนน (Road)
                    </label>
                    <input
                      type="text"
                      name="road"
                      onChange={(event) => handleChange(event, "road")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ถนน (Road)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      แขวง/ตำบล (Sub-district)
                    </label>
                    <input
                      type="text"
                      name="subDistrict"
                      onChange={(event) => handleChange(event, "subDistrict")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="แขวง/ตำบล (Sub-district)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เขต/อำเภอ (District)
                    </label>
                    <input
                      type="text"
                      name="district"
                      onChange={(event) => handleChange(event, "district")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="เขต/อำเภอ (District)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      จังหวัด (Province)
                    </label>
                    <input
                      type="text"
                      name="province"
                      onChange={(event) => handleChange(event, "province")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="จังหวัด (Province)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      รหัสไปรษณีย์ (Postal code)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
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
                      onChange={(event) => handleChange(event, "tel")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="โทรศัพท์ (Telephone)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เลขบัตรประชาชน (ID card number)
                    </label>
                    <input
                      type="text"
                      name="citizenId"
                      onChange={(event) => handleChange(event, "citizenId")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="เลขบัตรประชาชน (ID card number)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      วันที่ออกบัตร (Issue date)
                    </label>
                    <input
                      type="text"
                      name="citizenIssueDate"
                      onChange={(event) =>
                        handleChange(event, "citizenIssueDate")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="วันที่ออกบัตร (Issue date)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      วันหมดอายุบัตร (Expire date)
                    </label>
                    <input
                      type="text"
                      name="citizenExpireDate"
                      onChange={(event) =>
                        handleChange(event, "citizenExpireDate")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="วันหมดอายุบัตร (Expire date)"
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
                      ประเภทการเบิกเงิน (Type of request)
                    </label>
                    <input
                      type="text"
                      name="claimType"
                      onChange={(event) => handleChange(event, "claimType")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ประเภทการเบิกเงิน (Type of request)"
                      defaultValue={"test"}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 ">
                      กรณีอื่นๆ โปรดระบุ (Other case, please specify)
                    </label>
                    <input
                      type="text"
                      name="claimOtherReason"
                      onChange={(event) =>
                        handleChange(event, "claimOtherReason")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="กรณีอื่นๆ โปรดระบุ (Other case, please specify)"
                      defaultValue={"test"}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      จำนวนเงิน (Amount)
                    </label>
                    <input
                      type="text"
                      name="amount"
                      onChange={(event) => handleChange(event, "amount")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="จำนวนเงิน (Amount)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      บัญชีธนาคาร (Bank account)
                    </label>
                    <input
                      type="text"
                      name="bankCompany"
                      onChange={(event) => handleChange(event, "bankCompany")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="บัญชีธนาคาร (Bank account)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      สาขา (Branch)
                    </label>
                    <input
                      type="text"
                      name="bankBranch"
                      onChange={(event) => handleChange(event, "bankBranch")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="สาขา (Branch)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ประเภทบัญชี (Account type)
                    </label>
                    <input
                      type="text"
                      name="bankAccountType"
                      onChange={(event) =>
                        handleChange(event, "bankAccountType")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="ประเภทบัญชี (Account type)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      ชื่อบัญชี (Account name)
                    </label>
                    <input
                      type="text"
                      name="bankAccountName"
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
                      type="text"
                      name="bankAccountNumber"
                      onChange={(event) =>
                        handleChange(event, "bankAccountNumber")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="เลขที่บัญชี (Account number)"
                    />
                  </div>
                </div>
              </section>
            </div>
            <div>
              <div className="flex justify-between mt-8">
                {/*TODO Edit Link*/}
                <a href="/home">
                  <button className="bg-gray-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11">
                    Back
                  </button>
                </a>

                <button
                  onClick={handleSubmit}
                  className="bg-pink-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                >
                  Next
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
