import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";
function OPD({ handleChange }) {
  const [datePickers, setDatePickers] = useState([{}]); // Initialize with one date picker

  const addDatePicker = () => {
    if (datePickers.length >= 5) return; // Limit to 5 date pickers
    setDatePickers([...datePickers, {}]); // Add a new date picker
    handleChange(
      {
        target: {
          name: `OPDTreatmentDateCount`,
          value: datePickers.length + 1,
        },
      },
      "OPDTreatmentDateCount"
    );
  };

  const removeDatePicker = () => {
    if (datePickers.length > 1) {
      setDatePickers(datePickers.slice(0, -1)); // Remove the last date picker
      handleChange(
        {
          target: {
            name: `OPDTreatmentDateCount`,
            value: datePickers.length - 1,
          },
        },
        "OPDTreatmentDateCount"
      );
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
              Date of Treatment {i + 1}
            </label>
            <DatePicker
              format="DD/MM/YYYY"
              name={`OPDTreatmentDate${i + 1}`}
              onChange={(date) => {
                handleChange(
                  {
                    target: {
                      name: `OPDTreatmentDate${i + 1}`,
                      value: format(date, "yyyy-MM-dd"),
                    },
                  },
                  `OPDTreatmentDate${i + 1}`
                );
              }}
              allowClear={false}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="hidden md:flex gap-4 mt-8">
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
            <div></div>
          </div>
        </div>
      ))}
      <div className="md:hidden flex gap-4 mt-8">
        {datePickers.length < 5 && (
          <button
            type="button"
            onClick={addDatePicker}
            className="bg-green-400 text-white px-4 py-2 rounded-md"
          >
            +
          </button>
        )}
        {datePickers.length > 1 && (
          <button
            type="button"
            onClick={removeDatePicker}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            -
          </button>
        )}
      </div>
    </div>
  );
}

export default OPD;
