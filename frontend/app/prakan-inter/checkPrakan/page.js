"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";

const RD = () => {
  // State to manage checkbox status
  const [checkboxes, setCheckboxes] = useState({
    Option1: false,
    Option2: false,
    Option3: false,
  });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "../../documents/prakan-inter/Health-claim-form-filled.pdf";
    link.download = "Health-claim-form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  const handleNavigation = (event, targetUrl) => {
    if (!allChecked()) {
      event.preventDefault();
      alert(
        "กรุณาทำเครื่องหมายในช่องทั้งหมดก่อนดำเนินการต่อ (Please check all the boxes before proceeding)"
      );
    } else {
      window.location.href = targetUrl;
    }
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
              Students, please prepare the following documents to submit to the
              staff
            </h3>
            <h3 className="text-lg font-normal mb-4 text-center">
              นิสิตโปรดเตรียมเอกสารดังนี้มายื่นให้เจ้าหน้าที่
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
                        1. Claim Form for Injury / Illness
                      </strong>
                    </div>
                  </label>

                  <label
                    htmlFor="Option2"
                    className="-mx-4 flex cursor-pointer items-start gap-4 p-4 has-[:checked]:bg-blue-50"
                  >
                    <div>
                      <strong className="font-medium text-gray-900">
                        2. Attending Physician's Report (Included in Claim Form)
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
                        6. Your copy of bank account passbook
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
            <a href="/rordor/checkData">
              <button className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition duration-300">
                Back
              </button>
            </a>

            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300"
            >
              Download
            </button>

            <a
              href="/home"
              onClick={(event) => handleNavigation(event, "/home")}
            >
              <button
                type="submit"
                className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition duration-300"
              >
                Confirm
                <ToastContainer />
              </button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RD;
