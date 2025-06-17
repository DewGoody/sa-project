'use client'
import React, { use, useEffect, useState } from 'react';
import { Button, Layout, Switch, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Menubar from '../component/menu';
import axios from 'axios';

const { Content, Sider } = Layout;

const App = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log("Services:", services);
    }
        , [services]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.post('/api/servicePeriod/getAll');
                const sorted = response.data.data
                    .map(s => ({ ...s, id: Number(s.id) }))
                    .sort((a, b) => a.id - b.id);
                setServices(sorted);
            } catch (error) {
                message.error('เกิดข้อผิดพลาดในการดึงข้อมูลบริการ');
                console.error(error);
            }
        };
        fetchServices();
    }
        , []);


    const toggleService = async (id) => {
        try {
            setLoading(true);
            const scrollY = window.scrollY;

            await axios.post('/api/servicePeriod/edit', {
                id,
                active: !services.find(service => service.id === id).active,
            });

            const response = await axios.post('/api/servicePeriod/getAll');
            const sorted = response.data.data
                .map(s => ({ ...s, id: Number(s.id) }))
                .sort((a, b) => a.id - b.id);
            setServices(sorted);

            window.scrollTo({ top: scrollY, behavior: 'auto' });

            message.success('อัปเดตสถานะบริการเรียบร้อยแล้ว');
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout style={{ height: "100vh" }}>
            <Sider width={320} style={{ background: "rgb(255,157,210)" }}>
                <Menubar />
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                    }}
                >
                    <div className='mb-5'>
                        <h1 className='font-extrabold text-3xl'>จัดการบริการ</h1>
                        <p className='text-gray-500'>เปิด/ปิดการใช้งานบริการต่างๆ</p>
                    </div>

                    <div className="space-y-4">
                        {services.length > 0 && (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <span className="text-lg">{service.type}</span>
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                        checked={service.active}
                                        onChange={() => toggleService(service.id)}
                                        loading={loading}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 text-gray-500 text-sm">
                        <p>หมายเหตุ: สถานะ "เปิด" หมายถึงบริการนั้นนิสิตสามารถใช้งานได้</p>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;