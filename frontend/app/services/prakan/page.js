// pages/form.js
"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import PrakanService from '../../../api/prakanService/prakanService.js';

export default function Form() {
  const [prakanData, setPrakanData] = useState({});
  const prakanService = new PrakanService();

  useEffect(() => {
    let tokens = localStorage.getItem("token");
    const params = {
      token : tokens
    }
    prakanService.cunex(params).then(response => {
      console.log(response);
    })
  })


  const handleChangeName = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, name: event.target.value });
  }

  const handleChangeId = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, id: event.target.value });
  }

  const handleChangePhone = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, phone: event.target.value });
  }
  const handleChangeFaculty = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, faculty: event.target.value });
  }
  const handleChangeDesAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desAcc: event.target.value });
  }
  const handleChangeEmail = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, email: event.target.value });
  }
  const handleChangeDesInj = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, desInj: event.target.value });
  }
  const handleChangeDateAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, dateAcc: event.target.value });
  }
  const handleChangePlaceAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeAcc: event.target.value });
  }
  const handleChangePlaceTreat = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, placeTreat: event.target.value });
  }
  const handleChangeTypeHos = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, typeHos: event.target.value });
  }
  const handleChangeMedicalFeeNum = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeNum: event.target.value });
  }
  const handleChangeBankAcc = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, bankAcc: event.target.value });
  }
  const handleChangeMedicalFeeText = (event) => {
    console.log(event.target.value);
    setPrakanData({ ...prakanData, medicalFeeText: event.target.value });
  }

  const handleSubmit = (event) => {
    console.log(prakanData);
    prakanService.createPrakanForm(prakanData);
  }




  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <h2 className="text-lg font-bold mb-4">Accidental Compensation Claim Form</h2>
          <form className="space-y-6">
            <section>
              <h3 className="text-md font-semibold mb-2">Personal & Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Name-Surname</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Name-Surname"
                    onChange={handleChangeName}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Phone Number"
                    onChange={handleChangePhone}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Faculty</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Faculty"
                    onChange={handleChangeFaculty}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Email"
                    onChange={handleChangeEmail}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Student ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Student ID"
                    onChange={handleChangeId}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-md font-semibold mb-2">Accident & Treatments Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Description of Injury</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Description of Injury"
                    onChange={handleChangeDesInj}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Place of Treatment</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Place of Treatment"
                    onChange={handleChangePlaceTreat}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="dessAcc"
                    onChange={handleChangeDesAcc}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Date of Accident</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Date of Accident"
                    onChange={handleChangeDateAcc}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type of Hospital</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type of Hospital"
                    onChange={handleChangeTypeHos}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Place of Accident</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Place of Accident"
                    onChange={handleChangePlaceAcc}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Bank Account Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Bank Account Number"
                    onChange={handleChangeBankAcc}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-md font-semibold mb-2">Net of Medical Fee Total Amount</h3>
              <div>
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Amount"
                  onChange={handleChangeMedicalFeeNum}
                />
              </div>
              <div>
                <label className="block text-gray-700">Text</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Text"
                  onChange={handleChangeMedicalFeeText}
                />
              </div>
            </section>

            <button
              onClick={handleSubmit}
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"

            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
