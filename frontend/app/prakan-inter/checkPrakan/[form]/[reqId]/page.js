"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../../../../components/Header";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const RD = () => {
  // State to manage checkbox status
  const [checkboxes, setCheckboxes] = useState({
    Option1: false,
    Option2: false,
    Option3: false,
  });
  const [profileData, setProfileData] = useState(null);
  const [createRequest, setCreateRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownload, setIsDownload] = useState(false);
  const router = useRouter();
  const { form } = useParams();
  const { reqId } = useParams();
  console.log(form);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/profile"); // Example API
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "../../../documents/prakan-inter/Health-claim-form-filled.pdf";
    link.download = "Health-claim-form.pdf";
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

    if (reqId !== "0") {
      router.push(`/appointment/${reqId}/0`);
    } else {
      const response = await axios.post(`/api/request/create`, {
        type: "Health insurance",
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
        router.push(`/appointment/${param}/0`);
      }
    }
  };
  const handleBack = () => {
    router.push(`/prakan-inter/${form}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        req1="Health Insurance For Foreigner Student (Claim Injury/Illness)"
        req2=""
      />
      <main className="flex justify-center items-center">
        <div className="bg-white p-8 w-full max-w-4xl">
          {/* Personal & Contact Information Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Please prepare the following documents to submit to the staff
            </h3>
            <h3 className="text-lg font-normal mb-4 text-center">
              โปรดเตรียมเอกสารดังนี้มายื่นให้เจ้าหน้าที่
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <fieldset>
                <legend className="sr-only">Checkboxes</legend>

                <div className="divide-y divide-gray-200">
                  <div className="items-center py-4">
                    <div className="font-medium text-gray-900 pr-4">1. Download เอกสารได้ที่นี่ </div>
                    <button
                      onClick={handleDownload}
                      className="mt-3 ml-3 px-3 py-2 bg-green-500 text-white text-base font-semibold rounded-lg shadow-md hover:bg-green-400 transition duration-300 w-32">
                      Download
                    </button>
                  </div>
                  <label
                    htmlFor="Option1"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900 ">
                        2. Claim Form for Injury / Illness
                      </strong>
                    </div>
                  </label>
                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        3. Original receipt
                      </strong>
                    </div>
                  </label>
                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        4. Medical certificate
                      </strong>
                    </div>
                  </label>
                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        5. Copy of student card
                      </strong>
                    </div>
                  </label>
                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        6. Copy of bank account passbook
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
                      Prepare the above documents
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
                      disabled={!isDownload}
                    />
                  </div>

                  <div>
                    <strong className="font-medium text-gray-900">
                      Download the file and verify the information
                    </strong>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Navigation Buttons */}
          {Object.values(checkboxes).filter(Boolean).length >= 2 && (
            <div className="flex justify-end mt-8">
              <button
                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
                onClick={handleBack}
              >
                Back
              </button>

              <a onClick={(event) => handleNavigation(event)}>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-400 text-white font-semibold ml-3 rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
                >
                  Book queue
                  <ToastContainer />
                </button>
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RD;
