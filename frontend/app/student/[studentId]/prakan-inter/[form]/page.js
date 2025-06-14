"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../../../components/Header.js";
import IPD from "./IPD.js";
import OPD from "./OPD.js";
import { useRouter, useParams } from "next/navigation";
import { set } from "date-fns";

function page() {
  const [prakanData, setPrakanData] = useState({});
  const [claimType, setClaimType] = useState("null");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [alreadyData, setAlreadyData] = useState(null);
  const { studentId } = useParams();
  const router = useRouter();
  const { form } = useParams();
  console.log("form : " + form);

  const fetchPrakanData = async () => {
    try {
      const response = await axios.post("/api/prakanInter/getDataById", {
        id: parseInt(form),
      });
      console.log("responseFetch", response.data.data);
      const dateList = ['IPDAmittedDate', 'IPDDischargedDate', 'OPDTreatmentDate1', 'OPDTreatmentDate2', 'OPDTreatmentDate3', 'OPDTreatmentDate4', 'OPDTreatmentDate5'];
      dateList.forEach((dateField) => {
        if (response.data.data[dateField]) {
          const formattedDate = response.data.data[dateField].split("T")[0];
          console.log("formattedDate", formattedDate);
          response.data.data[dateField] = formattedDate;
        }
      });
      setAlreadyData(response.data.data);
      setClaimType(response.data.data.claimType);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const studentData = alreadyData?.Student;
    setPrakanData((prevData) => ({
      ...prevData,
      ...alreadyData,
      ...studentData,
    }))
  }, [alreadyData]);




  console.log("alreadyData : ", alreadyData);

  const handleChange = (event, field) => {

    console.log(field + " : " + event.target.value);
    console.log("alreadydata inside :", event.target.value);
    setPrakanData({ ...prakanData, [field]: event.target.value });
    setAlreadyData({ ...alreadyData, [field]: event.target.value });
    if (field === "treatmentType") {
      setPrakanData({
        ...prakanData,
        [field]: event.target.value,
        OPDTreatmentDateCount: event.target.value === "outpatient" ? 1 : null, // Reset the count when treatment type changes
        IPDAdmittedDate: null,
        IPDDischargedDate: null,
        OPDTreatmentDate1: null,
        OPDTreatmentDate2: null,
        OPDTreatmentDate3: null,
        OPDTreatmentDate4: null,
        OPDTreatmentDate5: null,
      });
      setAlreadyData({
        ...alreadyData,
        [field]: event.target.value,
        OPDTreatmentDateCount: event.target.value === "outpatient" ? 1 : null, // Reset the count when treatment type changes
        IPDAdmittedDate: null,
        IPDDischargedDate: null,
        OPDTreatmentDate1: null,
        OPDTreatmentDate2: null,
        OPDTreatmentDate3: null,
        OPDTreatmentDate4: null,
        OPDTreatmentDate5: null,
      });
    }
  };

  useEffect(() => {
    console.log("title :", prakanData.title)
  }, [prakanData.title]);




  const handleSubmit = async (event) => {
    // event.preventDefault(); // Prevent the default form submission behavior

    // Option 2: Use a local variable for validation and submission
    let dataToCheck = { ...prakanData };

    // Ensure title is filled from alreadyData if missing
    if (!dataToCheck.title || dataToCheck.title === '') {
      dataToCheck.title = alreadyData?.title || "";
      setPrakanData(dataToCheck); // Optionally update state for UI consistency
    }

    // List of required fields
    const requiredFields = [
      "title", // Prefix
      "fnameEN", // First Name
      "lnameEN", // Last Name
      "id", // Student ID
      "phone_num", // Mobile phone number
      "email", // Email address
      "hospitalName", // Place of treatment
      "totalMedicalFees", // Total Medical Fees (Bath)
      "treatmentType", // Type of treatment
      "illnessDescription", // Description of illness
    ];

    // Check if all required fields are present and not empty
    for (let field of requiredFields) {
      if (!dataToCheck[field] || dataToCheck[field].toString().trim() === "") {
        alert(`Please fill in the "${field}" field.`);
        return;
      }
    }

    // Check if treatment type is selected
    if (dataToCheck.treatmentType === "null") {
      alert("Please select a treatment type.");
      return;
    }
    // Check if the total medical fees is a valid number
    if (isNaN(dataToCheck.totalMedicalFees)) {
      alert("Please enter a valid number for total medical fees.");
      return;
    }
    // Check if the total medical fees is greater than 0
    if (parseFloat(dataToCheck.totalMedicalFees) <= 0) {
      alert("Total medical fees must be greater than 0.");
      return;
    }

    if (dataToCheck.treatmentType === "inpatient") {
      const { IPDAmittedDate, IPDDischargedDate } = dataToCheck;
      if (!IPDAmittedDate) {
        alert("Please fill in the admitted date.");
        return;
      }
      if (!IPDDischargedDate) {
        alert("Please fill in the discharged date.");
        return;
      }
      if (new Date(IPDAmittedDate) > new Date(IPDDischargedDate)) {
        alert("Admitted date cannot be later than discharged date.");
        return;
      }
    }
    if (dataToCheck.treatmentType === "outpatient") {
      for (let i = 1; i <= dataToCheck.OPDTreatmentDateCount; i++) {
        const date = dataToCheck[`OPDTreatmentDate${i}`];
        if (!date) {
          alert(`Please fill in the treatment date ${i}`);
          return;
        }
      }
    }

    console.log(dataToCheck);
    let allData = { ...dataToCheck };
    let dataUpdate = { ...alreadyData, formId: form, ...profileData };
    console.log("allData", allData);
    console.log("dataUpdate", dataUpdate);
    if (studentId != '0') {
      if (form === "0") {
        axios
          .post("/api/prakanInter/create", allData)
          .then((response) => {
            console.log("Form submitted successfully:", response.data);
            router.push(
              `/student/${studentId}/prakan-inter/checkPrakan/${response.data.data.id}/${response.data.data.req_id}`
            );
          })
          .catch((error) => {
            console.error("Error submitting form:", error);
          });
      } else {
        axios
          .post("/api/prakanInter/update", dataUpdate)
          .then((response) => {
            console.log("Form submitted successfully:", response.data);
            router.push(`/student/${studentId}/prakan-inter/checkPrakan/${response.data.data.id}/${response.data.data.req_id}`);
          })

          .catch((error) => {
            console.error("Error submitting form:", error);
          });
        console.log("dataUpdate", dataUpdate);
      }
    }
    else {
      axios
        .post("/api/prakanInter/update", dataUpdate)
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          const req_id = response.data.data.req_id
          router.push(`/Admin/prakan-inter/0`);
        })

        .catch((error) => {
          console.error("Error submitting form:", error);
        });
      console.log("dataUpdate", dataUpdate);

    }

  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/profile"); // Example API
      console.log(response.data);
      response.data.phone_num = response.data.tel_num;
      setProfileData(response.data);
      setLoading(false);
      setClaimType("illness");
      //console.log(response.data);
      // Create a new object to hold the updated state
      const updatedData = {};
      Object.keys(response.data).forEach((key) => {
        updatedData[key] = response.data[key];
      });

      // Update the state once with the new object
      setPrakanData(updatedData);
      setPrakanData((prakanData) => ({
        ...prakanData,
      }));
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId !== '0') {
      fetchData();
    }
    fetchPrakanData();

  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className=" bg-white min-h-screen">
        <Header req1="Group Health Insurance Claim Form" />
        <div className=" mx-24 ">
          <main className="flex justify-center bg-white w-full">
            <div className="bg-white  w-full min-w-screen-6xl">
              <section className="ml-5 py-4">
                <div
                  class="flex items-center p-4 mb-4 text-sm text-pink-500 border border-pink-400 rounded-lg bg-pink-50 "
                  role="alert"
                >
                  <svg
                    class="shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span class="sr-only">Info</span>
                  <div>
                    This service covers illnesses only. For accidents, please
                    use the accident insurance claim service.{"   "}
                    <span
                      onClick={() => {
                        router.push(`/student/${studentId}/prakan/0`);
                      }}
                      className="font-medium underline cursor-pointer"
                    >
                      Click Here!
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold my-4 flex gap-4">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 ">
                    1
                  </span>
                  Personal information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-4  w-full  ">
                    <div className="">
                      <label className="block text-gray-700 mb-2">Prefix</label>
                      <input
                        required
                        type="text"
                        name="title"
                        //value={formData.Nametitle}
                        onChange={(event) => handleChange(event, "title")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Mr. / Mrs. / Miss"
                        value={alreadyData?.title}
                      />
                    </div>

                    <div className="pt-4 md:pt-0">
                      <label className="block text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="fnameEN"
                        //value={formData.Name}
                        onChange={(event) => handleChange(event, "fnameEN")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Name"
                        defaultValue={profileData?.fnameEN || alreadyData?.Student?.fnameEN}

                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 ">Surname</label>
                    <input
                      type="text"
                      name="lnameEN"

                      onChange={(event) => handleChange(event, "lnameEN")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="Surname"
                      defaultValue={profileData?.lnameEN || alreadyData?.Student?.lnameEN}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      onChange={(event) => handleChange(event, "id")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Student ID"
                      defaultValue={profileData?.id || alreadyData?.Student?.id}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Mobile phone number
                    </label>
                    <input
                      type="text"
                      name="tel_num"
                      //value={formData.religion}
                      onChange={(event) => handleChange(event, "phone_num")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Phone number"
                      defaultValue={profileData?.tel_num || alreadyData?.phone_num}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" for="email">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={alreadyData?.email}
                      onChange={(event) => handleChange(event, "email")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold my-4 pt-8 flex gap-4 ">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    2
                  </span>
                  Treatment details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Place of treatment
                    </label>
                    <input
                      type="text"
                      name="hospitalName"
                      onChange={(event) => handleChange(event, "hospitalName")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Hospital / Clinic Name"
                      value={alreadyData?.hospitalName}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Place of treatment 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="hospitalName2"
                      onChange={(event) => handleChange(event, "hospitalName2")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Hospital / Clinic Name (Optional)"
                      value={alreadyData?.hospitalName2}
                    />
                  </div>
                </div>
                <div>
                  <div className="grid gap-4 pt-4 ">
                    <label className="block text-gray-700 ">
                      Description of illness
                    </label>
                    <textarea
                      name="hospitalName2"
                      onChange={(event) =>
                        handleChange(event, "illnessDescription")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Description of illness"
                      value={alreadyData?.illnessDescription}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Type of treatment
                      </label>
                      <select
                        name="treatmentType"
                        onChange={(event) =>
                          handleChange(event, "treatmentType")
                        }
                        value={prakanData.treatmentType}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="null">Select type of treatment</option>
                        <option value="inpatient">Inpatient (IPD)</option>
                        <option value="outpatient">Outpatient (OPD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Total Medical Fees (Bath)
                      </label>
                      <input
                        type="number"
                        data-type="currency"
                        name="totalMedicalFees"
                        value={prakanData.totalMedicalFees}

                        onChange={(event) =>
                          handleChange(event, "totalMedicalFees")
                        }

                        onBlur={(event) => {
                          event.target.value = prakanData.totalMedicalFees;
                          console.log("totalMedicalFees", parseFloat(event.target.value).toFixed(2));
                          setPrakanData({
                            ...prakanData,
                            totalMedicalFees: parseFloat(event.target.value).toFixed(2),
                          });
                          setAlreadyData({
                            ...alreadyData,
                            totalMedicalFees: parseFloat(event.target.value).toFixed(2),
                          });
                        }}
                        step="0.01"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Total Medical Fees (Bath)"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
                {prakanData?.treatmentType === "inpatient" ? (
                  <IPD handleChange={handleChange} prakanData={prakanData} alreadyData={alreadyData} />
                ) : prakanData?.treatmentType === "outpatient" ? (
                  <OPD handleChange={handleChange} prakanData={prakanData} alreadyData={alreadyData} />
                ) : null}
                <h3 className="text-lg font-semibold my-4 pt-8">
                  *Access to policy benefit details is available at{" "}
                  <a
                    href="https://www.sa.chula.ac.th/service/health-insurance-for-foreigner-student/"
                    className="text-blue-500 hover:underline"
                    target="_blank" // Open link in a new tab
                    rel="noopener noreferrer" // Security best practice
                  >
                    https://www.sa.chula.ac.th
                  </a>
                </h3>
              </section>

              <div className="flex justify-between mt-8">
                <a
                  onClick={() => {
                    if (studentId != '0') {
                      router.push(`/student/${studentId}/home`);
                    } else
                      router.push(`/Admin/prakan-inter/0`);
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

export default page;