import React, { useState } from "react";

function OPD({ handleChange }) {
  const [datePickers, setDatePickers] = useState([{}]); // Initialize with one date picker

  const addDatePicker = () => {
    setDatePickers([...datePickers, {}]); // Add a new date picker
  };

  const removeDatePicker = () => {
    if (datePickers.length > 1) {
      setDatePickers(datePickers.slice(0, -1)); // Remove the last date picker
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold my-4 pt-8 flex gap-4 ">
        <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          3
        </span>
        Treatment type : Outpatient (OPD)
      </h3>

      {datePickers.map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
          <div>
            <label className="block text-gray-700 mb-2">
              Date of treatment {i + 1}
            </label>
            <input
              type="date"
              name={`OPDTreatmentDate${i + 1}`}
              onChange={(event) =>
                handleChange(event, `OPDTreatmentDate${i + 1}`)
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              max={new Date()?.toISOString()?.slice(0, 10)}
              required
            />
          </div>
          <div className="flex gap-4 mt-8">
            {i < 4 ? (
              <button
                type="button"
                onClick={addDatePicker}
                className="bg-green-400 text-white px-4 py-2 rounded-md"
              >
                +
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="bg-transparent text-transparent px-4 py-2 rounded-md"
              >
                +
              </button>
            )}
            {datePickers.length > 1 && i > 0 ? (
              <button
                type="button"
                onClick={removeDatePicker}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                -
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OPD;
