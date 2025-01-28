'use client'
import { useState,useEffect, use } from 'react';
import { Header } from '../../../components/Header';
import { UserOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import RedirectOnBack from './RedirectOnBack';
import axios from "axios";
export default function ScholarshipPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectFetchDate, setSelectFetchDate] = useState([]);
  const [morningIdx,setMorningIdx] = useState(0);
  const [afternoonIdx,setAfternoonIdx] = useState(0);
  const [timeSlotId, setTimeSlotId] = useState(0);
  const [reqType, setReqType] = useState('');
  const [morningAvailable,setMorningAvailable] = useState([]);
  const [afternoonAvailable,setAfternoonAvailable] = useState([]);
  const [dateSelected, setDateSelected] = useState((false));
  const [showTimeSlotsMorning, setShowTimeSlotsMorning] = useState(false);
  const [showTimeSlotsAfterNoon, setShowTimeSlotsAfterNoon] = useState(false);
  const [isMorningOpen, setIsMorningOpen] = useState([]);
  const [isAfternoonOpen, setIsAfternoonOpen] = useState([]);

  const router = useRouter();
  const { id } = useParams(); //id is reqId
  const {queueId} = useParams();
  console.log("reqid", id);
  console.log("queueId",queueId)
 
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
      console.log("getAll : ",response.data.data);
      setSelectFetchDate(response.data.data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const fetchReqType = async () => {
    try {
      const response = await axios.post(`/api/request/getById`, {id: id});
      console.log("reqType",response.data.data.type);
      setReqType(response.data.data.type);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  console.log("profileDataKuy",profileData)
  
  useEffect(() => {
    fetchAllDate();
  }, []);
  useEffect(() => {
    fetchReqType();
  }, [profileData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/profile'); // Example API
        setProfileData(response.data);
        setLoading(false);
        console.log("profile",response.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
    
  }, [selectedDate]);

  const createQueue = async () => {
    try {
      if(selectedPeriod === 'morning'){
        if(queueId!=0){
          const response = await axios.post(`/api/queue/create`, {
            studentId: parseInt(profileData.id, 10),
            reqId: id,
            timeslotId: timeSlotId,
            period: morningIdx,
            queueId: queueId
          });
          console.log("responseMorning",response);
          const uid = response.data.uid
          console.log("uid",uid)
          router.push(`/waiting-appointment/${id}/${queueId}/${uid}`);

        }
        else{
          const response = await axios.post(`/api/queue/create`, {
            studentId: parseInt(profileData.id, 10),
            reqId: id,
            timeslotId: timeSlotId,
            period: morningIdx,
            queueId: null
          });
          console.log("responseMorning",response);
          const uid = response.data.uid
          console.log("uid",uid)
          router.push(`/waiting-appointment/${id}/${queueId}/${uid}`);
        }
        
      }else if(selectedPeriod === 'afternoon'){
        if(queueId!=0){
          const response = await axios.post(`/api/queue/create`, {
            studentId: profileData.id,
            reqId:id,
            timeslotId: timeSlotId,
            period: afternoonIdx,
            queueId: queueId
          });
          console.log("responseAfterNoon",response.data);
          const uid = response.data.uid
          console.log("uid",uid)
          router.push(`/waiting-appointment/${id}/${queueId}/${uid}`);
        }else{
          const response = await axios.post(`/api/queue/create`, {
            studentId: profileData.id,
            reqId:id,
            timeslotId: timeSlotId,
            period: afternoonIdx,
            queueId: null
          });
          console.log("responseAfterNoon",response.data);
          const uid = response.data.uid
          console.log("uid",uid)
          router.push(`/waiting-appointment/${id}/${queueId}/${uid}`);
        }
      }
      console.log("respobnse",response.data);
    }catch (err) {
      console.log("Error fetching amphures: " + err);
    }
  }
  
  const handleSubmit = () =>{
    createQueue();
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDateClick = async (item,id) => {
    console.log("item::",item);
    setSelectedDate(item.date);
    setMorningAvailable(item.is_full.slice(0, item.is_full.length / 2));
    setAfternoonAvailable(item.is_full.slice(item.is_full.length / 2));
    setIsMorningOpen(item.is_open.slice(0, item.is_open.length / 2));
    setIsAfternoonOpen(item.is_open.slice(item.is_open.length / 2));
    setDateSelected(true);
    setTimeSlotId(id);
  };

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

  console.log("timeSlot",timeSlotsAfternoon)
  
  console.log("morningIdx",morningIdx)


  return (
    <>
      <RedirectOnBack />
      <Header 
        req1={reqType === "การเบิกจ่ายประกันอุบัติเหตุ" ? "การเบิกจ่ายประกันอุบัติเหตุ" : reqType === "การผ่อนผันเข้ารับราชการทหาร" ? "แบบคำขอผ่อนผันเข้ารับราชการทหาร" : reqType === "Health insurance" ? "Health insurance" :reqType === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร" ? "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร": ""} 
        req2={reqType === "การเบิกจ่ายประกันอุบัติเหตุ" ? "Accident insurance claim" : reqType === "การผ่อนผันเข้ารับราชการทหาร" ? "Military Service Postponement Request Form" : ""} 
      />
      <div className="flex flex-col items-center text-center p-6 font-sans min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">จองคิวเข้ารับบริการ (Booking reservation)</h1>
        <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-6 w-full max-w-xs shadow">
          <UserOutlined />
          <div className="text-left ml-8">
            <p className="text-gray-500">{profileData.fnameTH + " " + profileData.lnameTH}</p>
            <p className="text-gray-500">{profileData.id}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold">เลือกวันเข้ารับบริการ</h3>
          <h3 className="text-gray-800 font-semibold">(Select an appointment date)</h3>
          <div className="flex gap-4 mt-3">
            {selectFetchDate.map((item) => {
              const [year, month, day] = item.date.split('T')[0].split('-');
              const formattedDate = `${day}/${month}/${year}`;
                return item.is_full.every((isFull) => isFull === true) || item.is_open.every((isOpen) => isOpen === false) ? (
                <button
                  key={item.id}
                  className="py-2 px-4 rounded-lg bg-gray-300 text-red-500 cursor-not-allowed"
                  disabled
                >
                  {formattedDate} Full
                </button>
                ) : (
                <button
                  key={item.id}
                  onClick={() => handleDateClick(item, item.id)}
                  className={`py-2 px-4 rounded-lg ${selectedDate === item.date ? 'bg-pink-300 text-white border border-pink-800 shadow-md' : 'bg-pink-500 text-white hover:bg-pink-400'}`}
                >
                  {formattedDate}
                </button>
                );
            })}
            </div>
            </div>
            {dateSelected && (
            <div className="mb-6">
            <h3 className="text-gray-800 font-semibold">เลือกช่วงเวลา</h3>
            <h3 className="text-gray-800 font-semibold">(Select a time slot)</h3>
            <div className="flex gap-4 mt-3">
              {morningAvailable.includes(false) || isMorningOpen.includes(true) ? (
              <button
              onClick={() => handlePeriodClick('morning')}
              className={`py-2 px-4 rounded-lg ${selectedPeriod === 'morning' ? 'bg-pink-300 text-white border border-pink-800 shadow-md' : 'bg-pink-500 text-white hover:bg-pink-400'}`}
              >
              ช่วงเช้า (Morning)
              </button>
              ) : (
              <button
              className="py-2 px-4 rounded-lg bg-gray-300 text-red-500 cursor-not-allowed"
              disabled
              >
              ช่วงเช้า (Morning) Full
              </button>
              )}
              {afternoonAvailable.includes(false) || isAfternoonOpen.includes(true) ? (
              <button
              onClick={() => handlePeriodClick('afternoon')}
              className={`py-2 px-4 rounded-lg ${selectedPeriod === 'afternoon' ? 'bg-pink-300 text-white border border-pink-800 shadow-md' : 'bg-pink-500 text-white hover:bg-pink-400'}`}
              >
              ช่วงบ่าย (Afternoon)
              </button>
              ) : (
              <button
              className="py-2 px-4 rounded-lg bg-gray-300 text-red-500 cursor-not-allowed"
              disabled
              >
              ช่วงบ่าย (Afternoon) Full
              </button>
              )}
            </div>
            </div>
            )}
            {showTimeSlotsMorning && (
            <div className="mb-6">
            <h3 className="text-gray-800 font-semibold">เลือกช่วงเวลา</h3>
            <h3 className="text-gray-800 font-semibold">(Select a time slot)</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {timeSlotsMorning.map((timeSlot) => {
                const isFull = morningAvailable[timeSlotsMorning.indexOf(timeSlot)];
                const isOpen = isMorningOpen[timeSlotsMorning.indexOf(timeSlot)];
                return isFull || (!isOpen) ? (
                  <button
                  key={timeSlot}
                  className="py-2 px-4 rounded-lg bg-gray-300 text-red-500 cursor-not-allowed"
                  disabled
                  >
                  {timeSlot} Full
                  </button>
                ) : (
                  <button
                  key={timeSlot}
                  onClick={() => handleTimeSlotClick(timeSlot)}
                  className={`py-2 px-4 rounded-lg ${selectedTimeSlot === timeSlot ? 'bg-pink-300 text-white border border-pink-800 shadow-md' : 'bg-pink-500 text-white hover:bg-pink-400'}`}
                  >
                  {timeSlot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showTimeSlotsAfterNoon && (
          <div className="mb-6">
            <h3 className="text-gray-800 font-semibold">เลือกช่วงเวลา</h3>
            <h3 className="text-gray-800 font-semibold">(Select a time slot)</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {timeSlotsAfternoon.map((timeSlot) => {
                const isFull = afternoonAvailable[timeSlotsAfternoon.indexOf(timeSlot)];
                const isOpen = isAfternoonOpen[timeSlotsAfternoon.indexOf(timeSlot)];
                return isFull || (!isOpen) ? (
                  <button
                    key={timeSlot}
                    className="py-2 px-4 rounded-lg bg-gray-300 text-red-500 cursor-not-allowed"
                    disabled
                  >
                    {timeSlot} Full
                  </button>
                ) : (
                  <button
                    key={timeSlot}
                    onClick={() => handleTimeSlotClick(timeSlot)}
                    className={`py-2 px-4 rounded-lg ${selectedTimeSlot === timeSlot ? 'bg-pink-300 text-white border border-pink-800 shadow-md' : 'bg-pink-500 text-white hover:bg-pink-400'}`}
                  >
                    {timeSlot}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {selectedTimeSlot ? (
          <div className="mt-8 w-full max-w-xs">
            <div className="bg-pink-100 p-5 rounded-lg mb-4 text-gray-700">
              <p className="font-semibold">วันที่เข้ารับบริการ</p>
              <p className="font-semibold">(Service Appointment Date)</p>
              <p className='text-lg'>{selectedDate.split('T')[0].split('-').reverse().join('/')}</p>
              <p className="mt-2 font-semibold">ช่วงเวลา</p>
              <p className="font-semibold">(Time Slot)</p>
              <p className='text-lg'>{selectedTimeSlot}</p>
            </div>
            <div className='flex justify-around'>
              <a href='/home'>
                <button
                  onClick={() => setSelectedTimeSlot('')}
                  className="-ml-6 py-2 px-6 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500"
                >
                  Back to home
                </button>
              </a>
              <a>
                <button className="-mr-6 py-2 px-6 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-400"
                  onClick={handleSubmit}
                  htmlType="submit"
                >
                  Confirm booking
                </button>
              </a>
            </div>
          </div>
        ) : (
          <div className='flex justify-around mt-8 w-full max-w-xs'>
            <a href='/home'>
              <button
                className="py-2 px-6 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500"
              >
                Back to home
              </button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}