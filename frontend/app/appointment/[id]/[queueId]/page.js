'use client'
import { useState,useEffect, use } from 'react';
import { Header } from '../../../components/Header';
import { UserOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import RedirectOnBack from './RedirectOnBack';
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
  const [reqType, setReqType] = useState('');
  const [byDate, setByDate] = useState({data:{id:4}});
  const [indexSelectedDate, setIndexSelectedDate] = useState(0);
  const router = useRouter();
  const { id } = useParams(); //id is reqId
  const {queueId} = useParams();
  console.log("id", id);
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
      console.log("getAll : ",response.data);
      setSelectFetchDate(response.data);
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

  const handleDateClick = async (date,index) => {
    setSelectedDate(date);
    setShowTimeSlots(false);
    setIndexSelectedDate(index)
    setSelectedPeriod('');
    setSelectedTimeSlot('');
    const [day, month, thaiYear] = date.split("/");
    const gregorianYear = parseInt(thaiYear, 10) - 543;
    const formattedDate = `${gregorianYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    getByDate(formattedDate);
    console.log("byDate", formattedDate);
    selectFetchDate?.data?.forEach((item) => {
      const [year, month, day] = item.date.split('T')[0].split('-');
      const realDate = `${day}/${month}/${year}`;
      console.log("realDate", realDate);
      if (realDate === date) {
        setTimeSlotId(item.id);
      }
    });
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

  const isOpenPeriod = (index) =>{
    if(selectFetchDate.data[indexSelectedDate].is_open[index] == false){
      console.log("selectIndex",selectFetchDate.data[indexSelectedDate].is_open[index])
      return false
    }
    else{
      console.log("selectIndex",selectFetchDate.data[indexSelectedDate].is_open[index])
      return true
    }
  }

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
  

  const newDate = Array.isArray(selectFetchDate?.data)
    ? selectFetchDate.data
      .filter(items => !items.is_full.every(item => item === true))
      .map(items => {
        const [year, month, day] = items.date.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      })
    : [];

  console.log("newDate::", newDate);

  return (
    <>
    <RedirectOnBack />
    <Header 
                req1={reqType === "การเบิกจ่ายประกันอุบัติเหตุ" ? "การเบิกจ่ายประกันอุบัติเหตุ" : reqType === "การผ่อนผันเข้ารับราชการทหาร" ? "แบบคำขอผ่อนผันเข้ารับราชการทหาร" : ""} 
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
            {newDate.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(date, index)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedDate === date ? 'border-pink-400 bg-pink-100' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {selectedDate !== '' && (
          <div className="flex gap-8 mb-6">
            <button
              onClick={() => handlePeriodClick('morning')}
              className={`py-2 px-6 rounded-lg shadow-md ${
                selectedPeriod === 'morning' ? 'bg-pink-400 text-white' : 'bg-pink-200 text-white'
              } hover:bg-pink-500`}
            >
              ช่วงเช้า (Morning Session)
            </button>
            <button
              onClick={() => handlePeriodClick('afternoon')}
              className={`py-2 px-6 rounded-lg shadow-md ${
                selectedPeriod === 'afternoon' ? 'bg-pink-400 text-white' : 'bg-pink-200 text-white'
              } hover:bg-pink-500`}
            >
              ช่วงบ่าย (Afternoon Session)
            </button>
          </div>
        )}

        {showTimeSlotsMorning && (
          <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
            {timeSlotsMorning.map((slot, index) => (
              <button
                key={index}
                disabled={!isOpenPeriod(index)}
                onClick={() => handleTimeSlotClick(slot)}
                className={`py-2 px-4 rounded-lg ${
                  selectedTimeSlot === slot ? 'bg-pink-400 text-white' : 'bg-gray-200 text-black'
                } ${!isOpenPeriod(index) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-300'}`}
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
                disabled={!isOpenPeriod(index + 8)}
                onClick={() => handleTimeSlotClick(slot)}
                className={`py-2 px-4 rounded-lg ${
                  selectedTimeSlot === slot ? 'bg-pink-400 text-white' : 'bg-gray-200 text-black'
                } ${!isOpenPeriod(index + 8) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-300'}`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}

        {selectedTimeSlot ? (
          <div className="mt-8 w-full max-w-xs">
            <div className="bg-pink-100 p-5 rounded-lg mb-4 text-gray-700">
              <p className="font-semibold">วันที่เข้ารับบริการ</p>
              <p className="font-semibold">(Service Appointment Date)</p>
              <p className='text-lg'>{selectedDate}</p>
              <p className="mt-2 font-semibold">ช่วงเวลา</p>
              <p className="font-semibold">(Time Slot)</p>
              <p className='text-lg'>{selectedTimeSlot}</p>
            </div>
            <div className='flex justify-around'>
              <a href='/home'>
                <button
                  onClick={() => setSelectedTimeSlot('')}
                  className="py-2 px-6 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
                >
                  Back to home
                </button>
              </a>
              <a>
                <button className="py-2 px-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-400"
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
                className="py-2 px-6 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500"
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
