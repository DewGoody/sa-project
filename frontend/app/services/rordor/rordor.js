// pages/military-form.js
"use client"
import React from 'react';
import header from '../../components/header/page.js';

export default function MilitaryForm() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header />
      <main className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
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
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Faculty</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Faculty"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Student ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Student ID"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Department</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Department"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Current Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Current Address"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Email"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-md font-semibold mb-2">Military Domicile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Military domicile number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Military domicile number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Village (Province)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Village (Province)"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Sena Service Rank</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Sena Service Rank"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type of Military</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type of Military"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">District</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Address"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
