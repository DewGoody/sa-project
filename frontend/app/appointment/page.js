// pages/scholarship.js
'use client'
// pages/scholarship.js
import { useState,useEffect, use } from 'react';
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
  const [selectFetchDate, setSelectFetchDate] = useState([]);
  const [convertDate, setConvertDate] = useState('');
  const [morning, setMorning] = useState(false);
  const [afternoon, setAfternoon] = useState(false);
  const [showTimeSlotsMorning, setShowTimeSlotsMorning] = useState(false);
  const [showTimeSlotsAfterNoon, setShowTimeSlotsAfterNoon] = useState(false);
  const [morningIdx,setMorningIdx] = useState(0);
  const [afternoonIdx,setAfternoonIdx] = useState(0);
  const [timeSlotId, setTimeSlotId] = useState(0);
  const [byDate, setByDate] = useState({data:{id:4}});


  const timeSlotsMorning = 
  [
    '8:00-8:30', '8:30-9:00','9:00-9:30', '9:30-10:00','10:00-10:30', '10:30-11:00','11:00-11:30', '11.30-12.00',
  ];
  const timeSlotsAfternoon = 
  [
    '13:00-13:30', '13:30-14:00','14:00-14:30', '14:30-15:00','15:00-15:30', '15:30-16:00','16:00-16:30', '16.30-17.00',
  ];
  
  const fetchAllDate = async () => {
    try {
      const response = await axios.post('/api/timeslot/getAll'); // Example API
      console.log("getAll : ",response.data);
      response.data
      setSelectFetchDate(response.data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  

  useEffect(() => {
    fetchAllDate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/profile'); // Example API
        setProfileData(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    
    const checkAvailability = () => {
      let morningAvailable = false;
      let afternoonAvailable = false;
  
      selectFetchDate?.data?.forEach((items) => {
        const [year, month, day] = items.date.split('T')[0].split('-');
        const buddhistYear = (parseInt(year) + 543).toString();
        const realDate = `${day}/${month}/${buddhistYear}`;
        if (realDate === selectedDate) {
          for (let i = 0; i < items.is_full.length / 2; i++) {
            if (!items.is_full[i]) {
              morningAvailable = true;
            }
          }
          for (let i = items.is_full.length / 2; i < items.is_full.length; i++) {
            if (!items.is_full[i]) {
              afternoonAvailable = true;
            }
          }
        }
      });
  
      setMorning(morningAvailable);
      setAfternoon(afternoonAvailable);
    };
    fetchData();
    checkAvailability();
    
  }, [morning, afternoon, selectedDate]);

  const createQueue = async () => {
    try {
      if(selectedPeriod === 'morning'){
        const response = await axios.post(`/api/queue/create`, {
          studentId: parseInt(profileData.id,10),
          reqId:1,
          timeslotId: timeSlotId,
          period: morningIdx,
        });
        console.log(response.data);
      }else if(selectedPeriod === 'afternoon'){
        const response = await axios.post(`/api/queue/create`, {
          studentId: profileData.id,
          reqId:1,
          timeslotId: timeSlotId,
          period: afternoonIdx,
        });
        console.log(response.data);
      }
      console.log(response.data);
    }catch (err) {
      console.log("Error fetching amphures: " + err);
    }
  }
  
  const handleSubmit = () =>{
    createQueue();
    
  }

  const getByDate = async (date) => {
    try{
        const response = await axios.post(`/api/timeslot/getByDate`, {date: date});
      console.log("response.data",response.data);
      setByDate(response.data);
    }catch (err) {
      console.log("Error fetching amphures: " + err);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setShowTimeSlots(false);
    setSelectedPeriod('');
    setSelectedTimeSlot('');
    const [day, month, thaiYear] = date.split("/");

// Convert the Thai year to the Gregorian year
  const gregorianYear = parseInt(thaiYear, 10) - 543;

// Format as YYYY-MM-DD
  const formattedDate = `${gregorianYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  getByDate(formattedDate);
  console.log("byDate",byDate);
  setTimeSlotId(byDate.data.id);
  
    

  };
  console.log("timeSlotId",timeSlotId)
  console.log("selectDate",selectedDate);
  
  
  
  
  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    if(period === 'morning'){
      setShowTimeSlotsMorning(true);
      setShowTimeSlotsAfterNoon(false);
      

    }
    else if(period==='afternoon'){
      setShowTimeSlotsAfterNoon(true);
      setShowTimeSlotsMorning(false);
    }
    setSelectedTimeSlot('');
    
  };

  const handleTimeSlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    if(selectedPeriod === 'morning'){
      setMorningIdx(timeSlotsMorning.indexOf(timeSlot));
    }
    else if(selectedPeriod === 'afternoon'){
      setAfternoonIdx(timeSlotsAfternoon.indexOf(timeSlot)+8);
    }
  };
  console.log("selectedFetch",selectFetchDate)

  
  const timeSlot = selectFetchDate?.data?.map((items) => {
    const [year, month, day] = items.date.split('T')[0].split('-');
    const buddhistYear = (parseInt(year) + 543).toString();
    const realDate= `${day}/${month}/${buddhistYear}`;
    if(realDate === selectedDate){
      items.is_full.forEach((item, index) => {
        for(let i = 0; i < items.is_full.length/2; i++){
          if(item){
            timeSlotsMorning.splice(i, 1);
          }
        }
        for(let i = items.is_full.length/2; i < items.is_full.length; i++){
          if(item){
            timeSlotsAfetrnoon.splice(i, 1);
          }
        }
      }
    )}
  })

  console.log("timeSlot",timeSlotsAfternoon)

  const newDate = Array.isArray(selectFetchDate?.data)
    ? selectFetchDate.data
      .filter(items => !items.is_full.every(item => item === true))
      .map(items => {
        const [year, month, day] = items.date.split('T')[0].split('-');
        const buddhistYear = (parseInt(year) + 543).toString();
        return `${day}/${month}/${buddhistYear}`;
      })
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/');
        const [dayB, monthB, yearB] = b.split('/');
        return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
      })
    : [];

  console.log("newDate::", newDate);

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
          {newDate.map((date, index) => (
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

      {selectedDate && morning && afternoon && (
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

      {showTimeSlotsMorning && (
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          {timeSlotsMorning.map((slot, index) => (
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
      {showTimeSlotsAfterNoon && (
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          {timeSlotsAfternoon.map((slot, index) => (
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
           
          <a href="/home">
          <button className="py-2 px-6 bg-green-400 text-white rounded-lg shadow-md hover:bg-green-500"
              onClick={handleSubmit}
              htmlType="submit"
            >
              confirm
            </button>
          </a>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
