import React from "react";
import { useState } from "react";

function OPD({ handleChange, prakanData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold my-4 pt-8 flex gap-4 ">
        <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          3
        </span>
        Treatment type : Outpatient (OPD)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
        <div>
          <label className="block text-gray-700 mb-2">Date admitted</label>
          <input
            type="date"
            name="IPDAmittedDate"
            onChange={(event) => handleChange(event, "IPDAmittedDate")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date Amitted"
            max={new Date()?.toISOString()?.slice(0, 10)}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Date discharged</label>
          <input
            type="date"
            name="IPDDischargedDate"
            onChange={(event) => handleChange(event, "IPDDischargedDate")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date discharged"
            min={prakanData?.hospitalAmittedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default IPD;
