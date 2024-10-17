"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import numberToThaiText from "../components/numberToThaiText.js";

function page() {
  return (
    <>
      <div className=" bg-white min-h-screen">
        <Header
          req1="Accidental Compensation Claim Form (For International Students)"
          req2=""
        />
        <div className=" mx-24 ">
          <main className="flex justify-center bg-white w-full">
            <div className="bg-white  w-full min-w-screen-6xl">
              <section className="ml-5 py-4">
                <h3 className="text-lg font-semibold mb-4">
                  Personal & contact information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="flex space-x-4 w-full  ">
                    <div className="w-1/2">
                      <label className="block text-gray-700 mb-2">Prefix</label>
                      <input
                        type="text"
                        name="Nametitle"
                        //value={formData.Nametitle}
                        //onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Nametitle"
                      />
                    </div>

                    <div className="w-1/2">
                      <label className="block text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="Name"
                        //value={formData.Name}
                        //onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 ">Surname</label>
                    <input
                      type="text"
                      name="Surname"
                      //value={formData.Surname}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-600"
                      placeholder="Surname"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      //value={formData.citizenId}
                      // onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Student ID"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Faculty</label>
                    <input
                      type="text"
                      name="faculty"
                      // value={formData.birthDate}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Faculty"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      //value={formData.religion}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="text"
                      name="email"
                      //value={formData.ethnicity}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold my-4">
                  Accident & treatment details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2">
                      Description of injury
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      placeholder="Please specify according to the doctor's certificate"
                    ></textarea>
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-gray-700">
                      Description of accident
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      placeholder="Please specify according to the doctor's certificate"
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Place of treatment
                    </label>
                    <input
                      type="text"
                      name="placeOfTreatment"
                      //value={formData.citizenId}
                      // onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Place of treatment"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Type of hospital
                    </label>
                    <input
                      type="text"
                      name="faculty"
                      // value={formData.birthDate}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="TODO : Drop Downlist here"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Date of accident
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      //value={formData.religion}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="TODO : Datepicker here"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Place of accident
                    </label>
                    <input
                      type="text"
                      name="email"
                      //value={formData.ethnicity}
                      //onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Place of accident"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold my-4">
                  Net of medical fee total amount
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Medical fee (In number)
                    </label>
                    <input
                      type="text"
                      name="placeOfTreatment"
                      //value={formData.citizenId}
                      // onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Medical fee (In number)"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-between mt-8">
                {/*TODO Edit Link*/}
                <a href="/home">
                  <button className="bg-gray-400 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11">
                    Back
                  </button>
                </a>
                <a href="./prakan/checkPrakan">
                  <button
                    //onClick={handleSubmit}
                    className="bg-pink-300 hover:bg-ping-400 text-white font-bold py-2 px-4 rounded-md mb-11"
                  >
                    Next
                  </button>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default page;
