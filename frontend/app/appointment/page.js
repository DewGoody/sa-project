// pages/scholarship.js
'use client'
// pages/scholarship.js
import { useState,useEffect } from 'react';
import { Header } from '../components/Header';
import { UserOutlined } from '@ant-design/icons';
import axios from "axios";
export default function ScholarshipPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dates = ['11/11/2567', '12/11/2567', '13/11/2567', '14/11/2567'];
  const timeSlots = [
    '8:00-8:30', '8:30-9:00', '9:30-10:00', '10:30-11:00', '11.30-12.00',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/profile'); // Example API
        console.log(response.data);
        
        setProfileData(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowTimeSlots(false);
    setSelectedPeriod('');
    setSelectedTimeSlot('');
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    setShowTimeSlots(true);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <>
    <Header req1="" req2="" />
    <div className="flex flex-col items-center text-center p-6 font-sans min-h-screen bg-gray-50">
      <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-6 w-full max-w-xs shadow">
        <UserOutlined />
        <div className="text-left ml-8">
          <p className="text-gray-500">{ profileData.fnameTH + " " + profileData.lnameTH}</p>
          <p className="text-gray-500">{ profileData.id }</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-800 font-semibold">เลือกวันเข้ารับบริการ</h3>
        <div className="flex gap-4 mt-3">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedDate === date ? 'border-pink-400 bg-pink-100' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="flex gap-8 mb-6">
          <button
            onClick={() => handlePeriodClick('morning')}
            className={`py-2 px-6 rounded-lg shadow-md ${
              selectedPeriod === 'morning' ? 'bg-pink-400 text-white' : 'bg-pink-200 text-white'
            } hover:bg-pink-500`}
          >
            ช่วงเช้า
          </button>
          <button
            onClick={() => handlePeriodClick('afternoon')}
            className={`py-2 px-6 rounded-lg shadow-md ${
              selectedPeriod === 'afternoon' ? 'bg-pink-400 text-white' : 'bg-pink-200 text-white'
            } hover:bg-pink-500`}
          >
            ช่วงบ่าย
          </button>
        </div>
      )}

      {showTimeSlots && (
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSlotClick(slot)}
              className={`py-2 px-4 rounded-lg ${
                selectedTimeSlot === slot ? 'bg-pink-400 text-white' : 'bg-pink-200 text-white'
              } hover:bg-pink-300`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {selectedTimeSlot && (
        <div className="mt-8 w-full max-w-xs">
          <div className="bg-pink-100 p-4 rounded-lg mb-4 text-gray-700">
            <p className="font-semibold">วันที่เข้ารับบริการ</p>
            <p>{selectedDate}</p>
            <p className="mt-2 font-semibold">ช่วงเวลา</p>
            <p>{selectedTimeSlot}</p>
          </div>
          <div className='flex justify-around'>
            <button
              onClick={() => setSelectedTimeSlot('')}
              className="py-2 px-6 bg-red-400 text-white rounded-lg shadow-md hover:bg-red-500"
            >
              back
            </button>
            <button className="py-2 px-6 bg-green-400 text-white rounded-lg shadow-md hover:bg-green-500">
              confirm
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
