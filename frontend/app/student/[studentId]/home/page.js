'use client'
import React from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditFormOpen, setIsModalEditFormOpen] = useState(false);
  const [isModalCheckInfoOpen, setIsModalCheckInfoOpen] = useState(false);
  const [deleteQueueId, setDeleteQueueId] = useState('');
  const [deleteNotQueueId, setDeleteNotQueueId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [prakanDataLength, setPrakanDataLength] = useState(0);
  const [hasPonpan, setHasPonpan] = useState(false);
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
    console.log("item :", item);
    setDeleteQueueId(item.id);
    setPrakanDataLength(prakanData.length);
    setReqIdEdit(item.Request.id)
    console.log("comfirm", confirmDelete);
    console.log("prakanDataLength", prakanDataLength);
    setIsModalOpen(true);
  };

  const showModalEditForm = (item) => {
    console.log("item:", item);
    setReqIdEdit(item.Request.id)
    setDeleteQueueId(item.id);
    setPrakanDataLength(prakanData.length);
    setIsModalEditFormOpen(true);
  };

  const showModalNotQueue = (id) => {
    console.log("deleteIdNotQueue :", id);
    setNotQueueLength(notQueue.length);
    setDeleteNotQueueId(id);
    setNotQueueLength(notQueue.length);
    console.log("comfirm", confirmDelete);
    console.log("prakanDataLength", prakanDataLength);
    setIsModalOpen(true);
  }

  const showModalBookNotQueue = (item) => {
    setReqBookNotQueue(item.id);
    setIsModalScheduleNotQueueOpen(true);
  };

  const showModalBookQueue = (item) => {
    console.log("itemBookQueue", item);
    setReqBookQueue(item.req_id);
    setItemBookQueue(item.id);
    setIsModalScheduleOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalEditFormOpen(false);
    setIsModalScheduleNotQueueOpen(false);
  };

  const showModalCheckInfo = (item) => {
    console.log("info :", item);
    setMoreInfo(item);
    setIsModalCheckInfoOpen(true);
  };
  const timeSlots =
    [
      '8:00-8:30', '8:30-9:00', '9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11.30-12.00',
      '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16.30-17.00',
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
      const response = await axios.post('/api/queue/getByStuId', { studentId: profileData.id }); // Example API
      console.log("fetchQueue :", response.data.data);
      response.data.data.map((item) => {
        if (item.Request.type === "การผ่อนผันเข้ารับราชการทหาร") {
          setHasPonpan(true);
        } if (item.Request.type === "การสมัครนศท.รายใหม่และรายงานตัวนักศึกษาวิชาทหาร") {
          SETRD(true);
        }
      })
      console.log("hasPonpan", hasPonpan);
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
      const response = await axios.post('/api/request/getNotQueue', { id: profileData.id }); // Example API
      console.log("getNotQueue", response.data.data);
      response.data.data.map((item) => {
        console.log("item", item);

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
      console.log("formId", response.data.data[0].id);
      setFormId(response.data.data[0].id);
      setNotQueue(response.data.data);
      setLoading(false);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const fetchAllData = async () => {
    await fetchNotQueue();
    await fetchQueue();
  };

  useEffect(() => {
    fetchAllData();
  }, [profileData, deleteQueueId, deleteNotQueueId]);

  // useEffect(() => {
  //   const checkGCStatus = async () => {
  //     console.log("GC_time changed:", GC_time);
  //     if (GC_time.status === "ย้ายสิทธิ์ไม่สำเร็จ") {
  //       if (GC_time.created_at) {
  //         const createdAt = new Date(GC_time.created_at);
  //         const currentDate = new Date();
  //         const timeDiff = Math.abs(currentDate - createdAt);
  //         const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //         console.log("diffDays", diffDays);
  //         if (diffDays > 30) {
  //           try {
  //             await axios.post('/api/request/delete', { id: GC_time.id }); 
  //             window.location.reload();
  //           } catch (error) {
  //             console.error("Error deleting request:", error);
  //           }
  //         }
  //       }
  //     }
  //   };

  //   checkGCStatus();
  // }, [GC_time]);

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
      const response = await axios.post('/api/queue/delete', { id: deleteQueueId }); // Example API
      const res = await axios.post('/api/request/delete', { id: reqIdEdit }); // Example API
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
      const response = await axios.post('/api/request/delete', { id: deleteNotQueueId }); // Example API
      setConfirmDelete(true);
      setDeleteNotQueueId(0);
      setIsModalOpen(false);
      console.log("responseDeleteNotQueue", response.data);
    } catch (error) {
      setError(error.message);
      console.log("errorNotqueue", error);
      setLoading(false);
    }
  }

  const handleEditForm = async (id) => {
    // console.log("sfjkfhksjdfnsmd,nfsdm,nfds,mnfsd,",id);
    console.log("editFormReqId : ", id);
    const response = await axios.post('/api/request/getById', { id: id }); // Example API
    console.log("editFormResponse :", response.data.data);
    router.push(`/student/${studentId}/${response.data.data.path}/${response.data.data.form}`);
  }

  const handleEditFormDeleteQueue = async (id) => {
    console.log("editFormReqId : ", id);
    const res = await axios.post('/api/queue/delete', { id: deleteQueueId }); // Example API

    setConfirmDelete(true);
    setPrakanDone(false);
    setDeleteQueueId(0);
    const response = await axios.post('/api/request/getById', { id: reqIdEdit }); // Example API
    // const resDelete = await axios.post('/api/request/delete',{id: reqIdEdit}); // Example API
    console.log("editFormResponse :", response.data.data);
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
                  prakanData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mt-5">
                      {((item.Request.status !== "คำขอถูกยกเลิก") && (item.status === "จองคิวสำเร็จ" || item.status === "เข้ารับบริการแล้ว")) && (
                        <div className="flex justify-between border border-gray-200 bg-white shadow-md rounded-xl p-6 w-full">
                          <div className="">
                            {count++ + ". " + item.Request.type + "  " + formatDate(item.Timeslot.date) + " (" + timeSlots[item.period] + " น.)"}
                            <div className="ml-4 text-md">
                              {item.Request.type === "การผ่อนผันเข้ารับราชการทหาร" && item.Request.status === "ติดต่อรับเอกสาร" && (
                                <div className=" flex font-semibold text-base text-blue-500">
                                  ตั้งแต่ 1 	มีนาคมเป็นต้นไป รับเอกสารได้ที่
                                </div>
                              )}
                              <p className="text-gray-500 font-semibold text-base">อาคารจุลจักรพงษ์ ชั้น 2</p>
                              <p className="text-gray-500 font-semibold text-base">(CHULACHAKRAPONG BUILDING, 2nd Floor)</p>
                            </div>
                            {(item.Request.type === "การผ่อนผันเข้ารับราชการทหาร" && item.Request.status === "ส่งเอกสารแล้ว") ? (
                              <div className="ml-4 mt-1 font-semibold text-base text-blue-500">ส่งเอกสารให้ผู้ว่าราชการจังหวัดแล้ว</div>
                            ) : (
                              <div className="ml-4 mt-1 font-semibold text-base text-blue-500">
                                {
                                  (item.Request.type === 'การเบิกจ่ายประกันอุบัติเหตุ' && item.Request.status === 'ส่งเอกสารแล้ว') ? (
                                    <div className=" mt-1 font-semibold text-base text-blue-500">ส่งเอกสารให้บริษัทประกันแล้ว</div>
                                  ) : (
                                    <div className=" mt-1 font-semibold text-base text-blue-500">{item.Request.status}</div>
                                  )
                                }
                              </div>
                            )
                            }

                          </div>

                          {item.Request.status === "รอเข้ารับบริการ" ? (
                            <div className="mb-3 flex mr-1">
                              <button
                                className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10"
                                onClick={() => { showModalEditForm(item) }}
                              >
                                Edit form
                              </button>
                              <button
                                className="bg-pink-500 hover:bg-pink-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2"
                                onClick={() => { showModalBookQueue(item) }}
                              >
                                Schedule
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10 ml-2"
                                onClick={() => { showModal(item) }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (item.Request.status === "ขอข้อมูลเพิ่มเติม" || item.Request.status === "โอนเงินเรียบร้อย" || item.Request.status === "ไม่อนุมัติ") && (
                            <div className="ml-3 mt- mb-3 flex">
                              <button onClick={() => { showModalCheckInfo(item.Request.more_info) }} className="bg-blue-500 hover:bg-blue-400 text-white text-xs py-2 px-4 rounded mt-10 mb-10">
                                view detail
                              </button>

                            </div>

                          )
                          }



                        </div>
                      )}

                    </div>
                  ))
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
                              <div className="mt-1 font-semibold text-base text-blue-500">{item.status}</div>
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
                                onClick={() => handleEditForm(item.id)}
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
              <a onClick={() => router.push(`/student/${studentId}/student-loan`)}
                className="block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ServiceCard
                  title="6. กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) "
                />
              </a>
              <a onClick={() => router.push(`/student/${studentId}/vendor/0`)}
                className="block cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ServiceCard
                  title="7. แบบคำขอรับเงินผ่านธนาคารสำหรับผู้ขาย (Vendor)"
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
        title="ต้องการลบคิวและจองคิวใช่ไหม (Do you want delete to booking new queue ?)"
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
        title="ต้องการจองคิวใช่ไหม (Do you want to booking queue ?)"
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