import React from "react";

function AccidentForm() {
  return (
    <div>
      <h3 className="text-lg font-semibold my-4 flex gap-4">
        <span class=" text-lg font-semibold flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          3
        </span>
        Accident & treatment details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ">
        <div>
          <label className="block text-gray-700 mb-2">Date of Accident</label>
          <input
            type="date"
            name="accidentDate"
            // value={formData.birthDate}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date of Accident"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Time of Accident</label>
          <input
            type="time"
            name="accidentTime"
            //value={formData.religion}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="w-full md:col-span-2">
          <label className="block text-gray-700 mb-2">Cause of Accident</label>
          <textarea
            id="accidentCause"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Cause of Accident"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Hospital / Clinic name
          </label>
          <input
            type="text"
            name="hospitalName"
            //value={formData.citizenId}
            // onChange={handleChange}
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
              //onChange={handleChange}
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
              //onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Hospital / Clinic's Phone number"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Date Amitted (into Hospital / Clinic)
          </label>
          <input
            type="date"
            name="accidentDate"
            // value={formData.birthDate}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date of Accident"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">
            Date discharged (from Hospital / Clinic)
          </label>
          <input
            type="date"
            name="accidentDate"
            // value={formData.birthDate}
            //onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Date of Accident"
          />
        </div>
      </div>
    </div>
  );
}

export default AccidentForm;
