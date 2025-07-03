import React from "react";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";

function IPD({ handleChange, prakanData, alreadyData }) {
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);

  // Log data for debugging
  useEffect(() => {
    console.log("IPD prakanData:", prakanData);
    console.log("IPD alreadyData:", alreadyData);
  }, [prakanData, alreadyData]);
  return (
    <div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
        <div>
          <label className="block text-gray-700 mb-2">Date of admission</label>
          <DatePicker
            format="DD/MM/YYYY"
            name="IPDAmittedDate"
            value={
              (prakanData?.IPDAmittedDate && dayjs(prakanData.IPDAmittedDate, "YYYY-MM-DD")) ||
              (alreadyData?.IPDAmittedDate && dayjs(alreadyData.IPDAmittedDate, "YYYY-MM-DD")) ||
              null
            }
            onChange={(date) => {
              handleChange(
                {
                  target: {
                    name: "IPDAmittedDate",
                    value: date ? format(date, "yyyy-MM-dd") : "",
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
          <label className="block text-gray-700 mb-2">Date of discharge</label>
          <DatePicker
            format="DD/MM/YYYY"
            name="IPDDischargedDate"
            value={
              (prakanData?.IPDDischargedDate && dayjs(prakanData.IPDDischargedDate, "YYYY-MM-DD")) ||
              (alreadyData?.IPDDischargedDate && dayjs(alreadyData.IPDDischargedDate, "YYYY-MM-DD")) ||
              null
            }
            onChange={(date) => {
              handleChange(
                {
                  target: {
                    name: "IPDDischargedDate",
                    value: date ? format(date, "yyyy-MM-dd") : "",
                  },
                },
                "IPDDischargedDate"
              );
            }}
            allowClear={false}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            minDate={dayjs(prakanData?.IPDAmittedDate || alreadyData?.IPDAmittedDate)}
          />
        </div>
      </div>
    </div>
  );
}

export default IPD;
