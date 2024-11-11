"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header.js";
import numberToThaiText from "../components/numberToThaiText.js";
import AccidentForm from "./AccidentForm.js";
import IllnessForm from "./IllnessForm.js";
function page() {
  const [prakanData, setPrakanData] = useState({});
  const [claimType, setClaimType] = useState("null");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleChange = (event, field) => {
    console.log(field + " : " + event.target.value);
    setPrakanData({ ...prakanData, [field]: event.target.value });
  };

  const handleCiaimTypeChange = (event) => {
    setClaimType(event.target.value);
    handleChange(event, "claimType");
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // List of required fields
    const requiredFields = [
      "title",
      "lnameTH",
      "fnameTH",
      "id",
      "phone_num",
      "presentAddress",
      "bd",
      "businessAddress",
      "occupation",
    ];

    // Check if all required fields are present and not empty
    for (let field of requiredFields) {
      if (!prakanData[field] || prakanData[field].trim() === "") {
        alert(`Please fill in the "${field}" field.`);
        return;
      }
    }

    if (claimType === "accident") {
      const accidentRequiredFields = [
        "accidentDate",
        "accidentTime",
        "accidentCause",
        "hospitalName",
        "hospitalProvince",
        "hospitalPhoneNumber",
        "hospitalAmittedDate",
        "hospitalDischargedDate",
      ];

      for (let field of accidentRequiredFields) {
        if (!prakanData[field] || prakanData[field].trim() === "") {
          alert(`Please fill in the "${field}" field.`);
          return;
        }
      }
    } else if (claimType === "illness") {
      const illnessRequiredFields = [
        "hospitalName",
        "hospitalProvince",
        "hospitalPhoneNumber",
        "hospitalAmittedDate",
        "hospitalDischargedDate",
      ];

      for (let field of illnessRequiredFields) {
        if (!prakanData[field] || prakanData[field].trim() === "") {
          alert(`Please fill in the "${field}" field.`);
          return;
        }
      }
    } else {
      alert(`Please Select an Claim Type.`);
    }

    console.log(prakanData);
    let allData = { ...prakanData };
    axios
      .post("/api/prakanInterService", allData)
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
        window.location.href = "/prakan-inter/checkPrakan";
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/profile"); // Example API
        console.log(response.data);

        setProfileData(response.data);
        setLoading(false);

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
          businessAddress:
            "254 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok 10330",
          occupation: "College student",
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
        <Header
          req1="Claim Form For Injury/Illness (For International Students)"
          req2=""
        />
        <div className=" mx-24 ">
          <main className="flex justify-center bg-white w-full">
            <div className="bg-white  w-full min-w-screen-6xl">
              <section className="ml-5 py-4">
                <h3 className="text-lg font-semibold my-4 flex gap-4">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    1
                  </span>
                  Personal & contact information
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
                        placeholder="Nametitle"
                        defaultValue={profileData.title}
                      />
                    </div>

                    <div className="pt-4 md:pt-0">
                      <label className="block text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="fnameTH"
                        //value={formData.Name}
                        onChange={(event) => handleChange(event, "fnameTH")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Name"
                        defaultValue={profileData.fnameTH}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 ">Surname</label>
                    <input
                      type="text"
                      name="lnameTH"
                      //value={formData.Surname}
                      onChange={(event) => handleChange(event, "lnameTH")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="Surname"
                      defaultValue={profileData.lnameTH}
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
                      defaultValue={profileData.id}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone number
                    </label>
                    <input
                      type="text"
                      name="tel_num"
                      //value={formData.religion}
                      onChange={(event) => handleChange(event, "phone_num")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Phone number"
                      defaultValue={profileData.tel_num}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Present Address
                    </label>
                    <input
                      type="text"
                      name="presentAddress"
                      //value={formData.religion}
                      onChange={(event) =>
                        handleChange(event, "presentAddress")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Present address"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      name="bd"
                      //value={formData.religion}
                      onChange={(event) => handleChange(event, "bd")}
                      defaultValue={
                        profileData.bd
                          ? new Date(profileData.bd).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Birthdate"
                      max={new Date()?.toISOString()?.slice(0, 10)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Business Address
                    </label>
                    <input
                      type="text"
                      name="businessAddress"
                      //value={formData.religion}
                      onChange={(event) =>
                        handleChange(event, "businessAddress")
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      placeholder="Business Address"
                      value="254 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok 10330"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      //value={formData.religion}
                      onChange={(event) => handleChange(event, "occupation")}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-500"
                      value="College student"
                      disabled
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold my-4 flex gap-4">
                  <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                    2
                  </span>
                  Select an Claim Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Select an Claim Type
                    </label>
                    <select
                      id="claimType"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onChange={handleCiaimTypeChange}
                    >
                      <option defaultValue value="null">
                        Select an Claim Type
                      </option>
                      <option value="accident">Accident</option>
                      <option value="illness">Illness</option>
                    </select>
                  </div>
                  <div></div>
                </div>
                {claimType === "accident" ? (
                  <AccidentForm handleChange={handleChange} />
                ) : null}
                {claimType === "illness" ? (
                  <IllnessForm handleChange={handleChange} />
                ) : null}
              </section>

              <div className="flex justify-between mt-8">
                {/*TODO Edit Link*/}
                <a href="./">
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
