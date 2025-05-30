"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../../../../../../components/Header";
import axios from "axios";
import { useRouter, useParams } from 'next/navigation';
import "react-toastify/dist/ReactToastify.css";

const Page = () => {

  const router = useRouter();
  const { studentId } = useParams();
  const { req_id } = useParams();
  const { form } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [vendorForm, setVendorForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createRequest, setCreateRequest] = useState(null);
  const [isDownload, setIsDownload] = useState(false);
  console.log("reqId", req_id);

  const [checkboxes, setCheckboxes] = useState({
    Option1: false,
    Option2: false,
    Option3: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/profile'); // Example API
        console.log(response.data);

        setProfileData(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

  }, []);
  console.log(profileData);



  const handleDownload = async () => {
    const response = await axios.post('/api/vendor/createPdf', { form: form }, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = studentId + '_vendor.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownload(true);
  };

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
  const handleAllCheck = () => {
    const newState = Object.values(checkboxes).some((value) => !value);
    setCheckboxes(
      Object.keys(checkboxes).reduce((acc, key) => {
        acc[key] = newState;
        return acc;
      }, {})
    );
  };


  // Function to handle navigation attempt
  const handleNavigation = async (event) => {
    console.log(profileData.id, form);

    if (req_id !== "0") {
      router.push(`/student/${studentId}/appointment/${req_id}/0`);
    } else {
      const response = await axios.post(`/api/request/create`, {
        type: "แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย",
        status: "รอจองคิว",
        stuId: profileData.id,
        formId: form,
      });
      console.log("responseCreate:", response.data);
      setCreateRequest(response.data);
      const param = response.data.data.id;
      if (!allChecked()) {
        event.preventDefault();
        alert(
          "กรุณาทำเครื่องหมายในช่องทั้งหมดก่อนดำเนินการต่อ (Please check all the boxes before proceeding)"
        );
      } else {
        console.log("dataaa", vendorForm, "-------------------------------");

        //const response2 = await axios.post('/api/prakanInter/deletePdf', prakanData)
        router.push(`/student/${studentId}/appointment/${param}/0`);
      }
    }
  };


  const handleBack = () => {
    router.push(`/student/${studentId}/vendor/${form}`);
  };
  return (
    <div className="min-h-screen bg-white">
      <Header
        req1="แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย (Vendor)"
        req2="ผู้มีสิทธิ์รับเงินประเภทนิสิต ภายในจุฬาลงกรณ์มหาวิทยาลัย"
      />
      <main className="flex justify-center items-center">
        <div className="bg-white p-8 w-full max-w-4xl">
          {/* Personal & Contact Information Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-center">
              โปรดเตรียมเอกสารดังต่อไปนี้
            </h3>
            <h3 className="text-lg font-normal mb-4 text-center">
              Please prepare the following documents
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <fieldset>
                <legend className="sr-only">Checkboxes</legend>

                <div className="divide-y divide-gray-200">
                  <label
                    htmlFor="Option1"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900 ">
                        1. สำเนาบัตรประจำตัวนิสิต
                      </strong>
                    </div>
                  </label>
                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        2. สำเนาหน้าสมุดบัญชีธนาคาร
                        (โปรดตรวจสอบบัญชีที่ระบุให้โอนเงินต้องสามารถใช้งานได้ตามปกติ)
                      </strong>
                    </div>
                  </label>
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
                      id="Option1"
                      checked={checkboxes.Option1}
                      onChange={handleCheckboxChange}
                    />
                  </div>

                  <div>
                    <strong className="font-medium text-gray-900">
                      รับทราบรายการเอกสาร
                    </strong>
                  </div>
                </label>

                <label className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50">
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
                    <strong className="font-medium text-gray-900">
                      ดาวน์โหลดไฟล์และตรวจสอบข้อมูลแล้ว
                    </strong>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">

            <button
              className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
              onClick={handleBack}
            >
              Back
            </button>


            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300"
            >
              Download
            </button>

            <a
              onClick={(event) => handleNavigation(event)}
            >
              <button
                type="submit"
                className="px-6 py-3 bg-pink-400 text-white font-semibold ml-3 rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
              >
                Book queue
                <ToastContainer />
              </button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;