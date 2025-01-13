'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Modal, Spin } from 'antd';
import { Header } from '../../../../components/Header';
import axios from "axios";

const WaitingQueue = () => {
    const [statusUid, setStatusUid] = useState('');
    const [reqType, setReqType] = useState('');
    const router = useRouter();
    const { id } = useParams(); //id is reqId
    const {queueId} = useParams();
    const {uid} = useParams()
    console.log("id", id);
    console.log("queueId",queueId)
    console.log("uid",uid)
    const [isReqTypeFetched, setIsReqTypeFetched] = useState(false);

    const fetchUid = async () => {
        try {          
          const response = await axios.post('/api/queue/getByUid', {uid: uid}); // Example API
          console.log("fetchUid",response.data);
          setStatusUid(response.data.data.status);
        } catch (error) {
          setError(error.message);
        }
      }   
      const fetchReqType = async () => {
        try {
          const response = await axios.post(`/api/request/getByIdFast`, {id: id});
          console.log("reqType",response.data);
          setReqType(response.data.data.type);
          setIsReqTypeFetched(true);
        } catch (error) {
          setError(error.message);
          setLoading(false);
          
        }
      }

      useEffect(() => {
        fetchReqType();
    }, []);

    useEffect(() => {
        if (isReqTypeFetched) {
            const interval = setInterval(() => {
                fetchUid();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isReqTypeFetched]);
    
    console.log("statusUid :",statusUid)

    return ( 
        <>
            <Header 
                req1={reqType === "การเบิกจ่ายประกันอุบัติเหตุ" ? "การเบิกจ่ายประกันอุบัติเหตุ" : reqType === "การผ่อนผันเข้ารับราชการทหาร" ? "แบบคำขอผ่อนผันเข้ารับราชการทหาร" : ""} 
                req2={reqType === "การเบิกจ่ายประกันอุบัติเหตุ" ? "Accident insurance claim" : reqType === "การผ่อนผันเข้ารับราชการทหาร" ? "Military Service Postponement Request Form" : ""} 
            />
            <Modal
                title= {statusUid === 'จองคิวสำเร็จ' ? 'จองคิวสำเร็จ' : statusUid === 'คิวเต็ม' ? 'คิวเต็ม' : ''}
                visible={isNaN(statusUid)}
                footer={null}
                closable={false}
            >
                {statusUid === 'จองคิวสำเร็จ' ? (
                    <Button type="primary" style={{backgroundColor:"gray"}} onClick={() => router.push('/')}>
                        กลับหน้าแรก (Back to homepage)
                    </Button>
                ) : (
                    <Button type="primary" style={{backgroundColor:"gray"}} onClick={() => router.push(`/appointment/${id}/0`)}>
                        กลับไปหน้าจองคิวใหม่ (Back to queue page)
                    </Button>
                )}
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop:'-200px'}}>
                {!isNaN(statusUid) && (
                    <div>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin size="large" />
                            <p className='mt-7'>ระบบกำลังดำเนินการจองคิว</p>
                            <p>Waiting for the queue to be ready...</p>
                            <p className='text-2xl font-bold text-red-500 mt-2'>กรุณาอย่าปิดหน้านี้</p>
                            <p className='text-2xl font-bold text-red-500 mt-2'>Please don't leave this page</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WaitingQueue;