'use client'
import React, { use } from "react";
import { useRouter, useParams } from 'next/navigation';

import {
  FaUser,
  FaPlus,
  FaEye,
  FaCheck,
  FaRegHospital,
  FaGlobeAmericas,
} from "react-icons/fa";
import { DeleteOutlined, EditOutlined, FormOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from "date-fns";

export const Form = () => {
  const { studentId } = useParams();
  const [prakanData, setPrakanData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prakanDone, setPrakanDone] = useState(false);
  const [reqBookNotQueue, setReqBookNotQueue] = useState(false);
  const [reqBookQueue, setReqBookQueue] = useState(false);
  const [itemBoookQueue, setItemBookQueue] = useState(false);
  const [reqIdEditNotQueue, setReqIdNotQueue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditFormOpen, setIsModalEditFormOpen] = useState(false);
  const [isModalEditFormNotqueue, setIsModalEditFormNotQueue] = useState(false);
  const [isModalCheckInfoOpen, setIsModalCheckInfoOpen] = useState(false);
  const [deleteQueueId, setDeleteQueueId] = useState('');
  const [deleteNotQueueId, setDeleteNotQueueId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [prakanDataLength, setPrakanDataLength] = useState(0);
  const [hasPonpan, setHasPonpan] = useState(false);
  const [hasStudentloan, setHasStudentloan] = useState(false);
  const [formId, setFormId] = useState(0);
  const [notQueueLength, setNotQueueLength] = useState(0);
  const [notQueue, setNotQueue] = useState([]);
  const [moreInfo, setMoreInfo] = useState('');
  const [reqIdEdit, setReqIdEdit] = useState(0);
  const [isModalSheduleOpen, setIsModalScheduleOpen] = useState(false);
  const [isModalSheduleNotQueueOpen, setIsModalScheduleNotQueueOpen] = useState(false);
  const [RD, SETRD] = useState(false)
  const [GC, SETGC] = useState(false)
  const [GC_time, SETGC_time] = useState({ id: "", created_at: "", status: "" });
  const router = useRouter();
  const showModal = (item) => {
    // console.log("item :", item);
    setDeleteQueueId(item.id);
    setPrakanDataLength(prakanData.length);
    setReqIdEdit(item.Request.id)
    // console.log("comfirm", confirmDelete);
    // console.log("prakanDataLength", prakanDataLength);
    setIsModalOpen(true);
  };

  const showModalEditForm = (item) => {
    // console.log("item:", item);
    setReqIdEdit(item.Request.id)
    setDeleteQueueId(item.id);
    setPrakanDataLength(prakanData.length);
    setIsModalEditFormOpen(true);
  };

  const showModalEditFormNotQueue = (item) => {
    // console.log("item:", item);
    setReqIdNotQueue(item.id)
    // setReqIdEdit(item.id)
    // setDeleteNotQueueId(item.id);
    // setPrakanDataLength(notQueue.length);
    setIsModalEditFormNotQueue(true);
  };

  const showModalNotQueue = (id) => {
    // console.log("deleteIdNotQueue :", id);
    setNotQueueLength(notQueue.length);
    setDeleteNotQueueId(id);
    setNotQueueLength(notQueue.length);
    // console.log("comfirm", confirmDelete);
    // console.log("prakanDataLength", prakanDataLength);
    setIsModalOpen(true);
  }

  const showModalBookNotQueue = (item) => {
    setReqBookNotQueue(item.id);
    setIsModalScheduleNotQueueOpen(true);
  };

  const showModalBookQueue = (item) => {
    // console.log("itemBookQueue", item);
    setReqBookQueue(item.req_id);
    setItemBookQueue(item.id);
    setIsModalScheduleOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalEditFormOpen(false);
    setIsModalEditFormNotQueue(false);
    setIsModalScheduleNotQueueOpen(false);
    setIsModalScheduleOpen(false);
  };

  const showModalCheckInfo = (item) => {
    // console.log("info :", item);
    setMoreInfo(item);
    setIsModalCheckInfoOpen(true);
  };
  const timeSlots =
    [
      '8:00-8:30', '8:30-9:00', '9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00',
    ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');


  const fetchData = async () => {
    try {
      setLoading(true); // เพิ่มบรรทัดนี้
      const response = await axios.get('/api/profile');
      // console.log(response.data);
      setProfileData(response.data);
      setLoading(false); // เพิ่มบรรทัดนี้
    } catch (error) {
      setError(error.message);
      setLoading(false); // เพิ่มบรรทัดนี้
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/queue/getByStuId', { studentId: profileData.id }); // Example API
      // console.log("fetchQueue :", response.data.data);
      response.data.data.map((item) => {
        if (item.Request.type === "การผ่อนผันเข้ารับราชการทหาร") {
          setHasPonpan(true);
        }
        if (item.Request.type === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร") {
          SETRD(true);
        }
        if (item.Request.type === "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)") {
          setHasStudentloan(true);
        }
      })
      // console.log("hasPonpan", hasPonpan);
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
      setLoading(true);
      const response = await axios.post('/api/request/getNotQueue', { id: profileData.id }); // Example API
      // console.log("getNotQueue", response.data.data);
      response.data.data.map((item) => {
        console.log("item", item);
        if (item.type === "การผ่อนผันเข้ารับราชการทหาร") {
          setHasPonpan(true);
        }
        if (item.type === "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)") {
          setHasStudentloan(true);
        }
        if (item.type === "โครงการหลักประกันสุขภาพถ้วนหน้า") {
          SETGC(true);
          SETGC_time({
            id: item.id,
            created_at: item.created_at,
            status: item.status
          });
        }
        if (item.type === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร") {
          SETRD(true);
        }
      })
      // console.log("formId", response.data.data[0].id);
      setFormId(response.data.data[0].id);
      setNotQueue(response.data.data);
      console.log("FormId", formId);

      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  const fetchGolden = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/request/getNotQueueGoldencard', { id: profileData.id }); // Example API
      // console.log("getNotQueue", response.data.data);
      const goldenData = response.data.data;
      const goldenItem = goldenData.find(item => item.type === "โครงการหลักประกันสุขภาพถ้วนหน้า");
      response.data.data.map((item) => {
        // console.log("item", item);

        if (item.type === "โครงการหลักประกันสุขภาพถ้วนหน้า") {
          SETGC(true);
          SETGC_time({
            id: item.id,
            created_at: item.created_at,
            status: item.status
          });
        }
      })
      // console.log("formId", response.data.data[0].id);
      setFormId(prevFormId => Array.isArray(prevFormId) ? [...prevFormId, response.data.data[0].id] : [response.data.data[0].id]);
      setNotQueue(prevNotQueue => {
        // ตรวจสอบว่าข้อมูลนี้มีอยู่แล้วใน state หรือไม่
        const exists = prevNotQueue.some(item => item.id === goldenItem.id);

        // ถ้ายังไม่มี ให้เพิ่มเข้าไป
        if (!exists) {
          return [...prevNotQueue, goldenItem];
        }
        // ถ้ามีอยู่แล้ว คืนค่าเดิม
        return prevNotQueue;
      });
      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await fetchNotQueue();
      await fetchQueue();
      await fetchGolden();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("notQueue useffect", notQueue);
  }, [notQueue]);


  useEffect(() => {
    fetchAllData();
  }, [profileData, deleteQueueId, deleteNotQueueId]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleBookQueue = async () => {
    // console.log("item", item);
    const response = await axios.post('/api/queue/delete', { id: itemBoookQueue }); // Example API
    const queueId = 0
    // const id = item.req_id;
    router.push(`/student/${studentId}/appointment/${reqBookQueue}/${queueId}`);

  }

  const handleBookNotQueue = async (reqID) => {
    // const id = reqID;
    // console.log("req_IdNotqueue", id);
    const queueId = 0;
    // console.log("req_Id", id);
    router.push(`/student/${studentId}/appointment/${reqBookNotQueue}/${queueId}`);
  }

  const handleDeleteQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/queue/delete', { id: deleteQueueId }); // Example API
      const res = await axios.post('/api/request/delete', { id: reqIdEdit }); // Example API
      setConfirmDelete(true);
      setPrakanDone(false);
      setDeleteQueueId(0);
      setIsModalOpen(false);
      // console.log(response.data);
      fetchAllData();
      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const handleDeleteNotQueue = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/request/delete', { id: deleteNotQueueId });
      const deletedItem = notQueue.find(item => item.id === deleteNotQueueId);

      setNotQueue(prevNotQueue => {
        const newNotQueue = prevNotQueue.filter(item => item.id !== deleteNotQueueId);
        return newNotQueue;
      });

      // ตรวจสอบประเภทของรายการที่ลบ และอัพเดท state ตามเงื่อนไข
      if (deletedItem) {
        if (deletedItem.type === "โครงการหลักประกันสุขภาพถ้วนหน้า") {
          SETGC(false);
          SETGC_time({
            id: "",
            created_at: "",
            status: ""
          });
        }
        if (deletedItem.type === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร") {
          SETRD(false);
        }
      }

      setConfirmDelete(true);
      setDeleteNotQueueId(0);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditForm = async () => {
    // console.log("sfjkfhksjdfnsmd,nfsdm,nfds,mnfsd,",id);
    const response = await axios.post('/api/request/getById', { id: reqIdEditNotQueue }); // Example API
    // console.log("editFormResponse :", response.data.data);
    router.push(`/student/${studentId}/${response.data.data.path}/${response.data.data.form}`);
  }

  const handleEditFormDeleteQueue = async (id) => {
    // console.log("editFormReqId : ", id);
    const res = await axios.post('/api/queue/delete', { id: deleteQueueId }); // Example API

    setConfirmDelete(true);
    setPrakanDone(false);
    setDeleteQueueId(0);
    const response = await axios.post('/api/request/getById', { id: reqIdEdit }); // Example API
    // const resDelete = await axios.post('/api/request/delete',{id: reqIdEdit}); // Example API
    // console.log("editFormResponse :", response.data.data);
    router.push(`/student/${studentId}/${response.data.data.path}/${response.data.data.form}`);
    setIsModalEditFormOpen(false);

  }


  let count = 1;
  function formatDateThai(isoDate) {
    if (!isoDate) return "ไม่มีข้อมูล";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "รูปแบบวันที่ไม่ถูกต้อง";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เดือนเริ่มจาก 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Add this function at the top of your component, before the return statement
  const getStatusDisplay = (requestType, status) => {
    // Define your conditions and corresponding messages
    const statusMappings = [
      {
        condition: requestType === "การผ่อนผันเข้ารับราชการทหาร" && status === "ส่งเอกสารแล้ว",
        message: "ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'รอจองคิว',
        message: "รอจองคิว (waiting to book)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'รอเจ้าหน้าที่ดำเนินการ',
        message: "รอเจ้าหน้าที่ดำเนินการ (pending)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'ส่งเอกสารแล้ว',
        message: "ส่งเอกสารให้บริษัทประกันแล้ว (submitted)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'ขอข้อมูลเพิ่มเติม',
        message: "ขอข้อมูลเพิ่มเติม (information requested)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'ไม่อนุมัติ',
        message: "ไม่อนุมัติ (denied)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'โอนเงินเรียบร้อย',
        message: "โอนเงินเรียบร้อย (paid)"
      },

      {
        condition: requestType === 'Health insurance' && status === 'รอจองคิว',
        message: "รอจองคิว (waiting to book)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'รอเจ้าหน้าที่ดำเนินการ',
        message: "รอเจ้าหน้าที่ดำเนินการ (pending)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'ส่งเอกสารแล้ว',
        message: "ส่งเอกสารให้บริษัทประกันแล้ว (submitted)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'ขอข้อมูลเพิ่มเติม',
        message: "ขอข้อมูลเพิ่มเติม (information requested)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'ไม่อนุมัติ',
        message: "ไม่อนุมัติ (denied)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'โอนเงินเรียบร้อย',
        message: "โอนเงินเรียบร้อย (paid)"
      },
      {
        condition: requestType === 'การเบิกจ่ายประกันอุบัติเหตุ' && status === 'รอเข้ารับบริการ',
        message: "รอเข้ารับบริการ (waiting for service)"
      },
      {
        condition: requestType === 'Health insurance' && status === 'รอเข้ารับบริการ',
        message: "รอเข้ารับบริการ (waiting for service)"
      },
      {
        condition: requestType === 'กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)' && status === 'รอเจ้าหน้าที่ดำเนินการ',
        message: "เข้ารับบริการแล้ว"
      },

    ];

    // Find the first matching condition
    const matchedStatus = statusMappings.find(mapping => mapping.condition);

    // Return the custom message if found, otherwise return the original status
    return matchedStatus ? matchedStatus.message : status;
  };

  const renderButtons = (item) => {
    if (item.Request.status === "รอเข้ารับบริการ" && item.Request.type !== "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)") {
      return (
        <div className="mb-3 flex mr-1">
          <button onClick={() => showModalEditForm(item)} className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10">Edit form</button>
          <button onClick={() => showModalBookQueue(item)} className="bg-pink-500 hover:bg-pink-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2">Schedule</button>
          <button onClick={() => showModal(item)} className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2">Cancel</button>
        </div>
      );
    }

    if (
      item.Request.status === "ขอข้อมูลเพิ่มเติม" ||
      item.Request.status === "โอนเงินเรียบร้อย" ||
      item.Request.status === "ไม่อนุมัติ"
    ) {
      return (
        <div className="ml-3 mb-3 flex">
          <button onClick={() => showModalCheckInfo(item.Request.more_info)} className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10">view detail</button>
        </div>
      );
    }

    if (item.Request.status === "รอเข้ารับบริการ" && item.Request.type === "กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)") {
      return (
        <div className="ml-3 mb-3 flex">
          <button onClick={() => showModalBookQueue(item)} className="bg-pink-500 hover:bg-pink-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2">Schedule</button>
          <button onClick={() => showModal(item)} className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2">Cancel</button>
        </div>
      );
    }

    return null;
  };





  return (
    <div className="min-h-screen" >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Spin size="large" />
        </div>
      )}
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
            Department of Scholarships & Student Services, Office of the Student Affairs, Chulalongkorn University
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
                stu={true}
              />
            </div>
            <div className=" py-8">
              <div className="flex justify-between items-center mt-7">
                <p className="text-xl font-bold">รายการขอรับบริการ (Service request list)</p>
              </div>

              <div className=" justify-between items-center">
                {prakanData.length > 0 ? (
                  prakanData.map((item, index) => {
                    // Safely transform the type for display without mutating the original object
                    const displayType = item.Request.type === "แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย"
                      ? "แบบคำขอรับเงินผ่านธนาคาร (Vendor)"
                      : item.Request.type;
                    return (
                      <div key={index} className="flex justify-between items-center mt-5">
                        {((item.Request.status !== "คำขอถูกยกเลิก") && (item.status === "จองคิวสำเร็จ" || item.status === "เข้ารับบริการแล้ว")) && (
                          <div className="flex justify-between border border-gray-200 bg-white shadow-md rounded-xl p-6 w-full">
                            <div>
                              {count++ + ". " + displayType + "  " + formatDate(item.Timeslot.date) + " (" + timeSlots[item.period] + " น.)"}
                              <div className="ml-4 text-md">
                                {item.Request.type === "การผ่อนผันเข้ารับราชการทหาร" && item.Request.status === "ติดต่อรับเอกสาร" && (
                                  <div className="flex font-semibold text-base text-blue-500">ตั้งแต่ 1 มีนาคมเป็นต้นไป รับเอกสารได้ที่</div>
                                )}
                                <p className="text-gray-500 font-semibold text-base">อาคารจุลจักรพงษ์ ชั้น 2</p>
                                <p className="text-gray-500 font-semibold text-base">(CHULACHAKRAPONG BUILDING, 2nd Floor)</p>
                              </div>
                              <div className="ml-4 mt-1 font-semibold text-base text-blue-500">
                                {getStatusDisplay(item.Request.type, item.Request.status)}
                              </div>
                            </div>
                            {renderButtons(item)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : null}
                {Array.isArray(notQueue) && notQueue.length > 0 && (
                  notQueue.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border border-gray-200 bg-white shadow-md rounded-xl p-6 w-full mt-5">
                      <div>
                        {count++ + ". " + item.type}
                        <div>
                          <div className="ml-4 text-md">
                            {item.type !== "โครงการหลักประกันสุขภาพถ้วนหน้า" && (
                              <div>
                                <p className="text-gray-500 font-semibold text-base">อาคารจุลจักรพงษ์ ชั้น 2</p>
                                <p className="text-gray-500 font-semibold text-base">(CHULACHAKRAPONG BUILDING, 2nd Floor)</p>
                              </div>
                            )}
                            <div className="flex">

                              <div className="mt-1 font-semibold text-base text-blue-500">{item.type == "การเบิกจ่ายประกันอุบัติเหตุ" || item.type == "Health insurance" ? item.status + " (waiting to book)" : item.status}</div>
                              {/* <div className=" ml-1 mt-1 font-semibold text-base text-pink-500"> {item.more_info}</div> */}
                              {item.type == "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร" && item.RD_info && Array.isArray(item.RD_info) && item.RD_info.length > 0 && (
                                <div>
                                  {item.status == "เสร็จสิ้น" && (<div className=" ml-1 mt-1 font-semibold text-base text-pink-500">ไปศูนย์ฝึกวันที่ {formatDateThai(item.RD_info[0]?.date)} และ เตรียมเงินมาจำนวน {item.RD_info[0]?.money} บาท </div>)}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="mb-3 flex mr-1">
                        {(item.status == "ขอข้อมูลเพิ่มเติม" || item.status == "ย้ายสิทธิ์ไม่สำเร็จ") && (
                          <div className="ml-3 mt- mb-3 flex">
                            <button onClick={() => { showModalCheckInfo(item.more_info) }} className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10">
                              view detail
                            </button>
                          </div>
                        )}
                        {!(item.status === "ย้ายสิทธิ์สำเร็จ" ||
                          item.status === "ส่งข้อมูลให้ รพ. แล้ว" ||
                          item.status === "ย้ายสิทธิ์ไม่สำเร็จ") && (
                            <div className="ml-3 mt- mb-3 flex">
                              <button
                                className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10"
                                onClick={() => showModalEditFormNotQueue(item)}
                              >
                                Edit form
                              </button>
                            </div>

                          )
                        }
                        {item.type !== "โครงการหลักประกันสุขภาพถ้วนหน้า" && (
                          <div className="ml-3 mt- mb-3 flex">
                            <button className="bg-pink-500 hover:bg-pink-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10"
                              onClick={() => { showModalBookNotQueue(item) }}
                            >
                              Schedule
                            </button>
                          </div>

                        )}
                        {!(item.status === "ย้ายสิทธิ์สำเร็จ" ||
                          item.status === "ส่งข้อมูลให้ รพ. แล้ว" ||
                          item.status === "ย้ายสิทธิ์ไม่สำเร็จ") && (
                            <div className="ml-3 mt- mb-3 flex">
                              <button
                                className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10"
                                onClick={() => { showModalNotQueue(item.id) }}
                              >
                                Cancel
                              </button>
                            </div>

                          )}

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
              <a onClick={() => router.push(`/student/${studentId}/prakan/0`)}
                className="block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ServiceCard
                  title="1. การเบิกจ่ายประกันอุบัติเหตุ (Accident insurance claim)"
                />
              </a>

              <a
                onClick={() => !RD && router.push(`/student/${studentId}/rordor/0`)}
                className={`block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg 
                              ${RD ? "pointer-events-none opacity-50" : ""}`}
              >
                <ServiceCard
                  title="2. การสมัคร นศท. รายใหม่และรายงานตัวนักศึกษาวิชาทหาร (Application and registration for Thai Reserve Officer Training Corps Students)"
                />
              </a>

              <a
                onClick={() => !hasPonpan && router.push(`/student/${studentId}/ponpan/0`)}
                className={`block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg 
                  ${hasPonpan ? "pointer-events-none opacity-50" : ""}`}
              >
                <ServiceCard
                  title="3. การขอผ่อนผันการเข้ารับราชการทหาร (Request for deferral of military service)"
                />
              </a>

              <a
                onClick={() => !GC && router.push(`/student/${studentId}/golden_card/0`)}
                className={`block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg 
                  ${GC ? "pointer-events-none opacity-50" : ""}`}
              >
                <ServiceCard
                  title="4. โครงการหลักประกันสุขภาพถ้วนหน้า (Universal Health Coverage Scheme)"
                />
              </a>
              <a onClick={() => router.push(`/student/${studentId}/prakan-inter/0`)}
                className="block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ServiceCard
                  title="5. Health Insurance for Foreigner Student"
                />
              </a>
              <a onClick={() => !hasStudentloan && router.push(`/student/${studentId}/student-loan`)}
                className={`block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg 
                  ${hasStudentloan ? "pointer-events-none opacity-50" : ""}`}
              >
                <ServiceCard
                  title="6. กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) "
                />
              </a>
              <a onClick={() => router.push(`/student/${studentId}/vendor/0`)}
                className="block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ServiceCard
                  title="7. แบบคำขอรับเงินผ่านธนาคาร (Vendor)"
                />
              </a>
            </div>

          </div>

        </main>
        <div className="absolute -bottom-2/4 -right-3/4 w-11/12 h-4/6 bg-pink-200 rounded-full"></div>
      </div>

      <Modal
        title="ยืนยันการยกเลิกคิวนี้แล้วแก้ไขฟอร์ม (Do you confirm to delete this queue and edit this form ?)"
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
        title="ยืนยันการแก้ไขฟอร์ม (Do you confirm to edit this form ?)"
        open={isModalEditFormNotqueue}
        onOk={handleEditForm}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: '#f9a8d4' },
          onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
          onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
        }}
      >
      </Modal>

      <Modal
        title="ยืนยันการลบคิวและจองคิว (Do you confirmto delete and booking new queue ?)"
        open={isModalSheduleOpen}
        onOk={handleBookQueue}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: '#f9a8d4' },
          onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
          onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
        }}
      >
      </Modal>

      <Modal
        title="ยืนยันการจองคิว (Do you confirm to booking queue ?)"
        open={isModalSheduleNotQueueOpen}
        onOk={handleBookNotQueue}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: '#f9a8d4' },
          onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = '#f472b6'),
          onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = '#f9a8d4'),
        }}
      >
      </Modal>


      <Modal
        title="ยืนยันการลบคำขอและยกเลิกคิวนี้ (Do you confirm to delete this request and cancel this queue ?)"
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
        title="ยืนยันลบคำขอนี้ ((Do you confirm to delete this request ?)"
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

      <Modal
        title=""
        open={isModalCheckInfoOpen}
        onCancel={() => setIsModalCheckInfoOpen(false)}
        footer={[
          <button
            key="close"
            onClick={() => setIsModalCheckInfoOpen(false)}
            className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded"
          >
            Close
          </button>,
        ]}
      >
        <div>
          <p>{moreInfo}</p>
          {/* Add any additional information you want to display here */}
        </div>
      </Modal>
    </div>
  );
}

const ServiceCard = ({ title, icon, stu }) => {
  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between border border-gray-200 shadow-md mt-8 rounded-xl p-6 bg-white">
      {/* Icon and Title */}
      <div className="flex items-center">
        {icon && <div className="text-xl">{icon}</div>}
        <div className="ml-6 text-gray-700 ">{title}</div>
      </div>

      {stu && (
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      )}
    </div>
  );
};


export default Form;