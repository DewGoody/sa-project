'use client'
import { useEffect, useState } from 'react';

export default function CheckInformation() {
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const time = urlParams.get('time');

    // Set the selected time from the URL parameter
    if (time) {
      setSelectedTime(time);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-10">Check Information</h1>

      <div className="bg-white mt-8 p-6 rounded-lg shadow-md w-96 text-center">
        {selectedTime ? (
          <>
            <h2 className="text-lg font-semibold">Selected Time Slot:</h2>
            <p className="text-pink-500 text-xl mt-2">{selectedTime}</p>
          </>
        ) : (
          <p className="text-gray-500">No time slot selected.</p>
        )}
      </div>
    </div>
  );
}
