import React from "react";
import { useState } from "react";

function IllnessForm({ handleChange, prakanData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold my-4 flex gap-4">
        <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          2
        </span>
        Treatment details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
        <div>
          <label className="block text-gray-700 mb-2">
            Hospital / Clinic name
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
        <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-4  w-full  ">
          <div>
            <label className="block text-gray-700 mb-2">Province</label>
            <input
              type="text"
              name="hospitalProvince"
              // value={formData.birthDate}
              onChange={(event) => handleChange(event, "hospitalProvince")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Hospital / Clinic's Province"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone number</label>
            <input
              type="text"
              name="hospitalPhoneNumber"
              //value={formData.religion}
              onChange={(event) => handleChange(event, "hospitalPhoneNumber")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Hospital / Clinic's Phone number"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Date admitted (into Hospital / Clinic)
          </label>
          <input
            type="date"
            name="hospitalAmittedDate"
            // value={formData.birthDate}
            onChange={(event) => handleChange(event, "hospitalAmittedDate")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date Amitted"
            max={new Date()?.toISOString()?.slice(0, 10)}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Date discharged (from Hospital / Clinic)
          </label>
          <input
            type="date"
            name="hospitalDischargedDate"
            // value={formData.birthDate}
            onChange={(event) => handleChange(event, "hospitalDischargedDate")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date discharged"
            min={prakanData?.hospitalAmittedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default IllnessForm;
