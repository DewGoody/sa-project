// pages/form.js
import React from 'react';
import header from '../components/header/page.js';

export default function Form() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header />
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
                  <label className="block text-gray-700">Faculty</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Faculty"
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
                <div>
                  <label className="block text-gray-700">Student ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Student ID"
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
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Place of Treatment</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Place of Treatment"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Date of Accident</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type of Hospital</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type of Hospital"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Place of Accident</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Place of Accident"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Bank Account Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Bank Account Number"
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
                />
              </div>
            </section>

            <button
              type="submit"
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
