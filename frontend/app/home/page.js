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
    const [deleteQueueId, setDeleteQueueId] = useState('');
    const [deleteNotQueueId, setDeleteNotQueueId] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [prakanDataLength, setPrakanDataLength] = useState(0);
    const [formId, setFormId] = useState(0);
    const [notQueueLength, setNotQueueLength] = useState(0);
    const [notQueue, setNotQueue] = useState([]);
    const router = useRouter();
    const showModal = (id) => {
      console.log("deleteId1 :",id);
      setDeleteQueueId(id);
      setPrakanDataLength(prakanData.length);
      console.log("comfirm",confirmDelete);
      console.log("prakanDataLength",prakanDataLength);
      setIsModalOpen(true);
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

  const handleBookQueue = async (queueID,reqID) => {
    const queueId = queueID
    const id = reqID;
    console.log("req_Id",id);
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

  let count = 1;

  return (
    <div className="min-h-screen bg-white">

      <Header req1="" req2="" />
      <main className="flex justify-center items-center ">
        <div className="bg-white p-8  w-full mx-72">
          <div>
            <ServiceCard
              className="border-black "
              title={profileData ? profileData.fnameTH + " " + profileData.lnameTH + " " + profileData.id : ""}
              icon={<FaUser />}
            />
          </div>

          <div className=" py-8">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">Status</p>
            </div>
            <div className=" justify-between items-center">
              {prakanData.length > 0 ? (
                prakanData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <ServiceCard
                      title={count++ + ". " + item.Request.type + "  " + formatDate(item.Timeslot.date) + " ( " + timeSlots[item.period] + " น.)" + " " + item.Request.status}
                    />
                    <div className="flex justify-around">
                      <div>
                        <button
                          className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded"
                          onClick={() => { handleBookQueue(item.id, item.req_id) }}
                        >
                          <CalendarOutlined />
                        </button>
                      </div>
                      <div>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                          onClick={() => { showModal(item.id) }}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
              {notQueue.length > 0 && (
                notQueue.map((item, index) => (
                  
                  <div key={index} className="flex justify-between items-center">
                    <ServiceCard
                      title={count++ + ". " + item.type + "  " + item.status}
                    />
                     <div>
                    <button 
                      className="bg-green-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded"
                      onClick={() => { handleEditForm(item.id) }}
                      >
                    <FormOutlined />
                    </button>
                    <button className="
                      bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded"
                      onClick={() => { handleBookNotQueue(item.id) }}
                      >
                    <CalendarOutlined />
                    </button>
                    <button 
                      className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                      onClick={() => { showModalNotQueue(item.id) }}
                      >
                      <DeleteOutlined />
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

          <p className="text-lg font-bold py-4">Service</p>
          <div className="space-y-8 ">
            <a href="/prakan/0">
              <ServiceCard
                title="1. การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)"
                icon={<FaCheck />}
              />
            </a>
            <a href="/rordor">
              <ServiceCard
                title="2. การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)"
                icon={<FaPlus />}
              />
            </a>
            <a href="/ponpan/0">
              <ServiceCard
                title="3. การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)"
                icon={<FaEye />}
              />
            </a>
            <a>
              <ServiceCard
                title="4. โครงการหลักประกันสุขภาพถ้วนหน้า (Universal Health Coverage Scheme)"
                icon={<FaRegHospital />}
              />
            </a>
            <a href="/prakan-inter">
              <ServiceCard
                title="5. Health Insurance For Foreigner Student"
                icon={<FaGlobeAmericas />}
              />
            </a>
          </div>
        </div>
      </main>
      {/* <Modal 
        title="ต้องการลบคิวใช่ไหม (Are you sure to delete queue)" 
        open={isModalOpen} 
        onOk={handleDeleteQueue} 
        onCancel={handleCancel} 
        okButtonProps={{ 
          style: { backgroundColor: '#f9a8d4' }, 
          onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
          onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
        }}
      >
      </Modal> */}
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
    <div className="flex justify-start items-center mt-10 rounded-xl p-8 shadow-lg bg-white border border-gray-700">
      <div className="text-2xl">{icon}</div>
      <div className=" ">
        <div className=" ml-6 border-gray-300"></div>
      </div>
    {icon ? (
      <div className="ml-5 text-gray-700">{title}</div>
    ) : (
      <div className="px-16">
        <p className=" -ml-28 text-gray-700 font-semibold">{title}</p>
        
      </div>
    )}
    </div>
  );
}


export default Form;