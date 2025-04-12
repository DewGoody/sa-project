"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../../../components/Header.js";
import AccidentForm from "./AccidentForm.js";
import IllnessForm from "./IllnessForm.js";
import { useRouter, useParams } from "next/navigation";

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

  const fetchData = async () => {
    try {
      const response = await axios.post("/api/prakanInter/getDataById", {
        id: parseInt(form),
      });
      console.log("responseFetch", response.data.data);
      setAlreadyData(response.data.data);
      setClaimType(response.data.data.claimType);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form !== "0") {
      fetchData();
    }
  }, []);

  console.log("alreadyData : ", alreadyData);

  const handleChange = (event, field) => {
    console.log(field + " : " + event.target.value);
    console.log("alreadydata inside :", event.target.value);
    setPrakanData({ ...prakanData, [field]: event.target.value });
    setAlreadyData({ ...alreadyData, [field]: event.target.value });
  };

  const handleCiaimTypeChange = (event) => {
    setClaimType(event.target.value);
    handleChange(event, "claimType");
  };

  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevent the default form submission behavior

    // List of required fields
    const requiredFields = [
      "title",
      "lnameEN",
      "fnameEN",
      "id",
      "phone_num",
      "email",
      "hospitalName",
      "hospitalProvince",
      "hospitalPhoneNumber",
      "hospitalAmittedDate",
      "hospitalDischargedDate",
    ];

    // Check if all required fields are present and not empty
    for (let field of requiredFields) {
      if (!prakanData[field] || prakanData[field].trim() === "") {
        alert(`Please fill in the "${field}" field.`);
        return;
      }
    }

    console.log(prakanData);
    let allData = { ...prakanData };
    let dataUpdate = { ...alreadyData, formId: form, ...profileData };
    console.log("allData", allData);
    console.log("dataUpdate", dataUpdate);
    if (form === "0") {
      axios
        .post("/api/prakanInter/create", allData)
        .then((response) => {
          console.log("Form submitted successfully:", response.data);
          router.push(
            `/student/${studentId}/prakan-inter/checkPrakan/${response.data.data.id}/0`
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
          router.push(
            `/student/${studentId}/prakan-inter/checkPrakan/${response.data.data.id}/${response.data.data.req_id}`
          );
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
      console.log("dataUpdate", dataUpdate);
    }
  };

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className=" bg-white min-h-screen">
        <Header req1="Health Insurance for Foreigner Student (Claim Illness)" />
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
                        defaultValue={profileData?.title}
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
                        defaultValue={profileData?.fnameEN}
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 ">Surname</label>
                    <input
                      type="text"
                      name="lnameEN"
                      //value={formData.Surname}
                      onChange={(event) => handleChange(event, "lnameEN")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="Surname"
                      defaultValue={profileData?.lnameEN}
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
                      //value={formData.citizenId}
                      onChange={(event) => handleChange(event, "id")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Student ID"
                      defaultValue={profileData?.id}
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
                      defaultValue={profileData?.tel_num}
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
                      //value={formData.citizenId}
                      onChange={(event) => handleChange(event, "hospitalName")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Hospital / Clinic Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Additional place of treatment (Optional)
                    </label>
                    <input
                      type="text"
                      name="hospitalName2"
                      //value={formData.citizenId}
                      onChange={(event) => handleChange(event, "hospitalName2")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Hospital / Clinic Name (Optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Type of treatment
                    </label>
                    <select
                      type="date"
                      name="treatmentType"
                      onChange={(event) => handleChange(event, "treatmentType")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="inpatient">Select treatment type</option>
                      <option value="inpatient">Inpatient (IPD)</option>
                      <option value="inpatient">Outpatient (OPD)</option>
                    </select>
                  </div>
                </div>
                <h3 className="text-lg font-semibold my-4 pt-8 flex gap-4 ">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    3
                  </span>
                  ⚠️ Please select treatment type. ⚠️
                </h3>
              </section>

              <div className="flex justify-between mt-8">
                <a
                  onClick={() => {
                    router.push(`/student/${studentId}/home`);
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

export default page;
