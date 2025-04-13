import React from "react";
import { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";

function IPD({ handleChange, prakanData }) {
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);
  return (
    <div>
      <h3 className="text-lg font-semibold my-4 pt-8 flex gap-4 ">
        <span className=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          3
        </span>
        Treatment type : Inpatient (IPD)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
        <div>
          <label className="block text-gray-700 mb-2">Date admitted</label>
          <DatePicker
            format="DD/MM/YYYY"
            name="IPDAmittedDate"
            onChange={(date) => {
              handleChange(
                {
                  target: {
                    name: "IPDAmittedDate",
                    value: format(date, "dd-MM-yyyy"),
                  },
                },
                "IPDAmittedDate"
              );
            }}
            allowClear={false}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            maxDate={dayjs(new Date()?.toISOString()?.slice(0, 10))}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Date discharged</label>
          <DatePicker
            format="DD/MM/YYYY"
            name="IPDDischargedDate"
            onChange={(date) => {
              handleChange(
                {
                  target: {
                    name: "IPDDischargedDate",
                    value: format(date, "dd-MM-yyyy"),
                  },
                },
                "IPDDischargedDate"
              );
            }}
            allowClear={false}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            minDate={dayjs(prakanData?.IPDAmittedDate, "DD-MM-YYYY")}
          />
        </div>
      </div>
    </div>
  );
}

export default IPD;
