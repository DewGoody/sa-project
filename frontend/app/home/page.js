'use client'
import React, { use } from "react";
import { Header } from "../components/Header";
import { useRouter } from 'next/navigation';

import {
  FaUser,
  FaPlus,
  FaEye,
  FaCheck,
  FaRegHospital,
  FaGlobeAmericas,
} from "react-icons/fa";
import { DeleteOutlined, EditOutlined, FormOutlined, CalendarOutlined  } from '@ant-design/icons';
import {Modal,Spin} from 'antd';
import {useState,useEffect} from 'react';
import axios from 'axios';

export const Form = () => {

  const [prakanData, setPrakanData] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [period, setPeriod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prakanDone,setPrakanDone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditFormOpen, setIsModalEditFormOpen] = useState(false);
    const [deleteQueueId, setDeleteQueueId] = useState('');
    const [deleteNotQueueId, setDeleteNotQueueId] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [prakanDataLength, setPrakanDataLength] = useState(0);
    const [formId, setFormId] = useState(0);
    const [notQueueLength, setNotQueueLength] = useState(0);
    const [notQueue, setNotQueue] = useState([]);
    const [reqIdEdit, setReqIdEdit] = useState(0);
    const router = useRouter();
    const showModal = (item) => {
      console.log("item :",item);
      setDeleteQueueId(item.id);
      setPrakanDataLength(prakanData.length);
      setReqIdEdit(item.Request.id)
      console.log("comfirm",confirmDelete);
      console.log("prakanDataLength",prakanDataLength);
      setIsModalOpen(true);
    };

    const showModalEditForm = (item) => {
      console.log("item:",item);
      setReqIdEdit(item.Request.id)
      setDeleteQueueId(item.id);
      setPrakanDataLength(prakanData.length);
      setIsModalEditFormOpen(true);
    };

    const showModalNotQueue = (id) => {
      console.log("deleteIdNotQueue :",id);
      setNotQueueLength(notQueue.length);
      setDeleteNotQueueId(id);
      setNotQueueLength(notQueue.length);
      console.log("comfirm",confirmDelete);
      console.log("prakanDataLength",prakanDataLength);
      setIsModalOpen(true);
    }
  
    const handleCancel = () => {
      setIsModalOpen(false);
      setIsModalEditFormOpen(false);
    };
    const timeSlots = 
  [
    '8:00-8:30', '8:30-9:00','9:00-9:30', '9:30-10:00','10:00-10:30', '10:30-11:00','11:00-11:30', '11.30-12.00',
    '13:00-13:30', '13:30-14:00','14:00-14:30', '14:30-15:00','15:00-15:30', '15:30-16:00','16:00-16:30', '16.30-17.00',
  ];
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
   
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
    
    useEffect(() => {
        fetchData();
      }, []);

      const fetchQueue = async () => {
        try {          
          const response = await axios.post('/api/queue/getByStuId',{studentId: profileData.id}); // Example API
          console.log("fetchQueue :",response.data);
          setPrakanData(response.data.data);
          setPrakanDone(true);
          setPeriod(response.data.data[0].Timeslot.period);
          setLoading(false);

        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }     
      
      const fetchNotQueue = async () => {
        try {          
          const response = await axios.post('/api/request/getNotQueue',{id:profileData.id}); // Example API
          console.log("getNotQueue",response.data.data);
          console.log("formId",response.data.data[0].id);
          setFormId(response.data.data[0].id);
          setNotQueue(response.data.data);
          setLoading(false);

        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }  
      useEffect(() => {
        fetchNotQueue();
        fetchQueue();
      }, [profileData,deleteQueueId,deleteNotQueueId]);
     
      console.log("prakanData", prakanData);
      console.log("prakanData length", prakanData.length);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleBookQueue = async (item) => {
    console.log("item",item);
    const queueId = item.id
    const id = item.req_id;
    router.push(`/appointment/${id}/${queueId}`);

  }

  const handleBookNotQueue = async (reqID) => {
    const id = reqID;
    const queueId = 0;
    console.log("req_Id",id);
    router.push(`/appointment/${id}/${queueId}`);
  }

  const handleDeleteQueue = async () => {
    try {
      const response = await axios.post('/api/queue/delete',{id: deleteQueueId}); // Example API
      const res = await axios.post('/api/request/delete',{id: reqIdEdit}); // Example API
      setConfirmDelete(true);
      setPrakanDone(false);
      setDeleteQueueId(0);
      setIsModalOpen(false);
      console.log(response.data);
     
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const handleDeleteNotQueue = async () => {
    try {
      const response = await axios.post('/api/request/delete',{id: deleteNotQueueId}); // Example API
      setConfirmDelete(true);
      setDeleteNotQueueId(0);
      setIsModalOpen(false);
      console.log("responseDeleteNotQueue",response.data);  
    } catch (error) {
      setError(error.message);
      console.log("errorNotqueue",error);
      setLoading(false);
    }
  }

  const handleEditForm = async (id) => {
    console.log("editFormReqId : ",id);
    const response = await axios.post('/api/request/getById',{id: id}); // Example API
    console.log("editFormResponse :",response.data.data);
    router.push(`/${response.data.data.path}/${response.data.data.form}`);
  }

  const handleEditFormDeleteQueue = async (id) => {
    console.log("editFormReqId : ",id);
    const res = await axios.post('/api/queue/delete',{id: deleteQueueId}); // Example API
   
    setConfirmDelete(true);
    setPrakanDone(false);
    setDeleteQueueId(0);
    const response = await axios.post('/api/request/getById',{id: reqIdEdit}); // Example API
    // const resDelete = await axios.post('/api/request/delete',{id: reqIdEdit}); // Example API
    console.log("editFormResponse :",response.data.data);
    router.push(`/${response.data.data.path}/${response.data.data.form}`);
    setIsModalEditFormOpen(false);
    
  }
 

  let count = 1;

  return (
    <div className="min-h-screen" >
       <div className="absolute -top-2/4 -left-3/4 w-11/12 h-4/6 bg-pink-200 rounded-full"></div>
      <div className="flex justify-center items-center">
        <div className="mt-8">
        <img src="https://www.car.chula.ac.th/carweb2/images/chula_logo.png" alt="profile"
              className=" h-32 w-20 mx-auto "

            />
        </div>
        <div className="mt-8 ml-4 items-center">
          <div className="text-xl font-bold">
            ฝ่ายทุนการศึกษาและบริการนิสิต สำนักบริหารกิจการนิสิต จุฬาลงกรณ์มหาวิทยาลัย
          </div>
          <div className="text-xs font-medium ml-9">
            Departmet of Schorships & Students Service. Office of the Student Affairs. Chulalongkorn University
          </div>
        </div>
      </div>
      <div className="min-h-screen  relative overflow-hidden">
      {/* <div className="absolute right-0  w-1/4 h-full rounded-tl-2xl bg-pink-300 z-0"></div> */}

      <main className="flex justify-center items-center  ">
     
        
        <div className=" p-8  w-full mx-72 z-10">
          <div>
            <ServiceCard
              title={profileData ? profileData.fnameTH + " " + profileData.lnameTH + " " + profileData.id : ""}
              icon={<FaUser />}
            />
          </div>

          <div className=" py-8">
            <div className="flex justify-between items-center mt-7">
              <p className="text-xl font-bold">รายการขอรับบริการ (Service request list)</p>
            </div>

            <div className=" justify-between items-center">
              {prakanData.length > 0 ? (
                prakanData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mt-5">
                    {(item.status === "จองคิวสำเร็จ" || item.status === "เข้ารับบริการแล้ว") && (
                    <div className="flex justify-between border border-gray-200 bg-white shadow-md rounded-xl p-6 w-full">
                      <div className="">
                      {count++ + ". " + item.Request.type + "  " + formatDate(item.Timeslot.date) + " ( " + timeSlots[item.period] + " น.)" + " " + item.Request.status}
                      </div>
                      
                          <div className="flex">
                            <button 
                              className="bg-stone-500 hover:bg-stone-400 text-white text-xs py-2 px-4 rounded"
                              onClick={() => { showModalEditForm(item) }}
                            >
                              Edit form
                            </button>
                            <button 
                              className="bg-pink-400 hover:bg-pink-300 text-white text-xs py-2 px-4 rounded ml-2"
                              onClick={() => { handleBookQueue(item) }}
                            >
                              Reschedule
                            </button>
                            <button 
                              className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded ml-2"
                              onClick={() => { showModal(item) }}
                            >
                              Cancel
                            </button>
                          </div>
                        
                    </div>
                    )}
                  </div>
                ))
              ) : null}
              {notQueue.length > 0 && (
                notQueue.map((item, index) => (
                  
                  <div key={index} className="flex justify-between items-center border border-gray-200 bg-white shadow-md rounded-xl p-6 w-full mt-5">
                   <div>
                    {count++ + ". " + item.type + "  " + item.status}
                   </div>
                     <div className="flex">
                    <button 
                      className="bg-stone-500 hover:bg-stone-400 text-white text-xs py-2 px-4 rounded"
                      onClick={() => { handleEditForm(item.id) }}
                      >
                    Edit form
                    </button>
                    <button className="
                      bg-pink-500 hover:bg-pink-400 text-white text-xs py-2 px-4 rounded ml-2"
                      onClick={() => { handleBookNotQueue(item.id) }}
                      >
                        Reschedule
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded ml-2"
                      onClick={() => { showModalNotQueue(item.id) }}
                      >
                      cancel
                    </button>
                  </div>
                  </div>
                  
                ))
              )}

              {prakanData.length === 0 && notQueue.length === 0 && (
                <div className="text-center mt-4">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xl font-bold py-4">บริการ (Service)</p>
          <div className="-mt-8">
            <a href="/prakan/0">
              <ServiceCard
                title="1. การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)"
              />
            </a>
            <a href="/rordor">
              <ServiceCard
                title="2. การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)"
              />
            </a>
            <a href="/ponpan/0">
              <ServiceCard
                title="3. การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)"
              />
            </a>
            <a>
              <ServiceCard
                title="4. โครงการหลักประกันสุขภาพถ้วนหน้า (Universal Health Coverage Scheme)"
              />
            </a>
            <a href="/prakan-inter/0">
              <ServiceCard
                title="5. Health Insurance For Foreigner Student"
              />
            </a>
            <a href="/">
              <ServiceCard
                title="6. กู้กองทุนเงินให้กู้ยืมเพื่อการศึกษา"
              />
            </a>
          </div>
         
        </div>
       
      </main>
        <div className="absolute -bottom-2/4 -right-3/4 w-11/12 h-4/6 bg-pink-200 rounded-full"></div>
      </div>

      <Modal 
      title="ต้องการยกเลิกคิวแล้วแก้ไขฟอร์มใช่ไหม (Are you sure to delete queue and edit form ?)" 
      open={isModalEditFormOpen} 
      onOk={handleEditFormDeleteQueue} 
      onCancel={handleCancel} 
      okButtonProps={{ 
        style: { backgroundColor: '#f9a8d4' }, 
        onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
        onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
      }}
    >
    </Modal>
      
      
    <Modal 
      title="ต้องการลบคิวใช่ไหม (Are you sure to delete queue)" 
      open={isModalOpen && deleteQueueId !== ''} 
      onOk={handleDeleteQueue} 
      onCancel={handleCancel} 
      okButtonProps={{ 
        style: { backgroundColor: '#f9a8d4' }, 
        onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
        onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
      }}
    >
    </Modal>
    <Modal 
      title="ต้องการลบคำขอใช่ไหม (Are you sure to delete request)" 
      open={isModalOpen && deleteNotQueueId !== ''} 
      onOk={handleDeleteNotQueue} 
      onCancel={handleCancel} 
      okButtonProps={{ 
        style: { backgroundColor: '#f9a8d4' }, 
        onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
        onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
      }}
    >
    </Modal>
    </div>
  );
}

const ServiceCard = ({ title, icon }) => {
  return (
    <div className="flex justify-start items-center border border-gray-200 shadow-md mt-8 rounded-xl p-8 bg-white" >
      <div className="text-xl">{icon}</div>
      <div className=" ">
        <div className=" ml-6 border-gray-300"></div>
      </div>
    {icon ? (
      <div className="ml-5 text-gray-700">{title}</div>
    ) : (
      <div className="px-16">
        <p className=" -ml-24 text-gray-700 font-normal">{title}</p>

      </div>
    )}
    </div>
  );
}


export default Form;