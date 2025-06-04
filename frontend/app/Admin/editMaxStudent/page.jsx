'use client'
import React, { use, useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Select, Modal, Form, Radio, message } from 'antd';
import axios from 'axios';
import Menubar from '../component/menu';
const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};


const { Header, Sider, Content } = Layout;

const AppointmentManagement = () => {
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const [loading, setLoading] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('7');
    const [statusRequest, setStatusRequest] = useState([]);
    const [shouldReload, setShouldReload] = useState(false);
    const [dateMaxStu, setDateMaxStu] = useState([])
    const [selectDate, setSelectDate] = useState();
    const [maxStu, setMaxStu] = useState();
    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();
    const [isModalDefaultVisible, setIsModalDefaultVisible] = useState(false);
    const [showModalDefault, setShowModalDeFault] = useState();

    const timeSlots =
        [
            '8:00-8:30', '8:30-9:00', '9:00-9:30', '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30', '11.30-12.00',
            '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30', '16.30-17.00',
        ];


    useEffect(() => {
        if (shouldReload) {
            window.location.reload();
        }
    }, [shouldReload]);
    useEffect(() => {
        if(isModalDefaultVisible===true){
            console.log("isModalDefaultVisible",isModalDefaultVisible);
        }},[])

    const fetchDefaultMaxStu = async () => {
        try {
            const res = await axios.post('/api/maxStu/getDefault');
            console.log("resDefaultMaxStu", res.data.data);
            setShowModalDeFault(res.data.data.max_stu);
            
        } catch (error) {
            console.error('Error fetching default max student:', error);
        }
    };

    const fetchGetAllTimeSlots = async () => {
        try {
            const res = await axios.post('/api/timeslot/getAll');
            console.log("resGetAll", res.data.data);
            const sortedData = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setDateMaxStu(...dateMaxStu, sortedData.map((item) => {
                const date = new Date(item.date);
                date.setDate(date.getDate() + 1);
                return {
                    date: date.toISOString().split('T')[0],
                };
            }));
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }
    };

    const handleDefaultMaxStuChange = async (input) => {
        setShowModalDeFault(input.target.value);
        console.log("inputDefault", input.target.value);
       
    };

    
    const handleDefaultMaxStuOk = async () => {
        setShouldReload(true);
        try {
            const res = await axios.post('/api/maxStu/editDefault', { max_stu: showModalDefault });
            console.log("resEditDefault", res);
        } catch (error) {
            console.error('Error editing default max student:', error);
        } finally {
            setShouldReload(false);
        }
    };
    const fetchTableData = async () => {
        try {
            const res = await axios.post('/api/maxStu/getAll');
            console.log("resMaxStu", res.data.data);
            setDataSource(res.data.data);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }
    };

    useEffect(() => {
        fetchGetAllTimeSlots();
        fetchTableData();
        fetchDefaultMaxStu();
    }, []);

    console.log("dataSource", dataSource);

    console.log("dateMaxStu", dateMaxStu);

    const handleOk = async () => {
        setShouldReload(true);
        try {
            const res = await axios.post('/api/timeslot/editMaxStudent', { date: selectDate, maxStu: maxStu });
            console.log("resEditMx", res);
        } catch (error) {
            console.error('Error editing max student:', error);
        } finally {
            setShouldReload(false);
        }
    };


    const handleSelectDate = async (date) => {
        const formattedDate = new Date(date)
        setSelectDate(formattedDate);
        console.log("date", formattedDate);
    }

    const handleMaxStuChange = async (input) => {
        setMaxStu(input);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newDate') {
            setEditingUser({ ...editingUser, [name]: new Date(value).toISOString() });
        } else {
            setEditingUser({ ...editingUser, [name]: value });
        }
    };

    console.log("editingUser", editingUser);
    const handleEdit = (record) => {
        console.log("recordEdit", record);
        setEditingUser({ ...record, oldDate: new Date(record.date).toISOString(), max_stu: record.max_stu, newDate: new Date(record.date).toISOString() });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const handleDelete = (record) => {
        console.log("recordDelete", record);
        setDeletingUser(record);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingUser(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await axios.post("/api/maxStu/delete", { date: deletingUser.date });
            setLoading(false);
            setIsDeleteModalVisible(false);
            setShouldReload(true);
            message.success("Reopened service successfully!");
        } catch (error) {
            setLoading(false);
            message.error("Reopened service failed!");
            console.error("Error:", error);
        }
    };

    const handleSave = async () => {
        try {
            console.log("editingUser", editingUser);
            setLoading(true);
            const response = await axios.post("/api/maxStu/edit", editingUser);
            setLoading(false);
            setIsModalVisible(false);
            setShouldReload(true);
            message.success("User updated successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            setLoading(false);
            message.error("Update failed!");
            console.error("Error:", error);
        }
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <Menubar />
            </Sider>
            <Layout style={{ background: "rgb(255,157,210)" }}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: "white",
                        borderTopLeftRadius: '20px',  // โค้งเฉพาะมุมบนซ้าย
                        borderBottomLeftRadius: '20px', // โค้งเฉพาะมุมล่างซ้าย

                    }}
                >
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            จัดการจำนวนผู้เข้ารับบริการ
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button 
                            className='bg-blue-500 text-white rounded-lg px-4 py-2'
                            onClick={() => setIsModalDefaultVisible(true)}
                        >
                        กำหนดค่าเริ่มต้น
                        </button>
                    </div>
                    <div className='mt-4'>

                        <Table
                            dataSource={dataSource}
                            columns={[
                                {
                                    title: 'วันที่',
                                    dataIndex: 'date',
                                    key: 'date',
                                    render: (text) => {
                                        const date = new Date(text);
                                        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                                    }
                                },
                                {
                                    title: 'จำนวนนิสิตที่รองรับได้ต่อรอบการให้บริการ',
                                    dataIndex: 'max_stu',
                                    key: 'max_stu',
                                },
                                {
                                    title: 'แก้ไข / ลบ',
                                    dataIndex: 'edit',
                                    render: (text, record) => (
                                        <Space size="middle">
                                            <Button
                                                // type="primary"
                                                onClick={() => {
                                                    handleEdit(record);
                                                }}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => {
                                                    handleDelete(record);
                                                }}
                                            >
                                                ลบ
                                            </Button>
                                        </Space>
                                    ),
                                },
                            ]}
                        />
                    </div>
                    <div className='w-3/12'>
                        <p>เลือกวัน</p>
                        <Input
                            type="date"
                            min={dateMaxStu[0]?.date}
                            onChange={(e) => handleSelectDate(e.target.value)}

                        />
                    </div>
                    <div className="mt-4 w-3/12">
                        <p>เลือกจำนวนนิสิตต่อรอบการให้บริการ</p>
                        <Input
                            placeholder="จำนวนนิสิต"
                            type="number"
                            onChange={(e) => handleMaxStuChange(e.target.value)}

                        />
                    </div>

                    <div className='absolute mt-6 '>
                        <Button type="primary" onClick={handleOk}>ยืนยัน</Button>
                    </div>
                    <Modal
                        title="แก้ไขจำนวนนิสิต"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                ปิดหน้าต่าง
                            </Button>,
                            <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                                บันทึก    
                            </Button>,
                        ]}
                    >
                        <Form form={formEdit} layout="vertical">

                            <Form.Item label="วันที่">
                                <Input
                                    type='date'
                                    name="newDate"
                                    value={editingUser?.newDate.split('T')[0]}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item label="จำนวนนิสิต">
                                <Input
                                    type='number'
                                    name="max_stu"
                                    value={editingUser?.max_stu}
                                    onChange={handleInputChange}
                                />

                            </Form.Item>

                        </Form>
                    </Modal>

                    <Modal
                        title="ต้องการลบจำนวนนิสิตที่รองรับได้ต่อรอบการให้บริการในวันนี้ใช่ไหม"
                        visible={isDeleteModalVisible}
                        onCancel={handleDeleteCancel}
                        footer={[
                            <Button key="cancel" onClick={handleDeleteCancel}>
                                ปิดหน้าต่าง
                            </Button>,
                            <Button key="delete" type="primary" loading={loading} onClick={handleDeleteConfirm}>
                                ลบ
                            </Button>,
                        ]}
                    >
                        {/* <p>คุณต้องการจะเปิดวันนี้ให้กลับมาให้บริการได้อีกครั้งใช่ไหม</p> */}
                    </Modal>

                    <Modal
                        title="กำหนดค่าเริ่มต้น"
                        visible={isModalDefaultVisible}
                        onCancel={() => setIsModalDefaultVisible(false)}
                        footer={[
                            <Button key="cancel" onClick={() => setIsModalDefaultVisible(false)}>
                                ปิดหน้าต่าง
                            </Button>,
                            <Button key="save" type="primary" loading={loading} onClick={handleDefaultMaxStuOk}>
                                บันทึก
                            </Button>,
                        ]}
                    >
                        <div>
                            <p>ค่าเริ่มต้นเดิม</p>
                            <Input
                                type='number'
                                name="max_stu"
                                value={showModalDefault}
                                disabled
                            />
                        </div>
                        <Form form={form} layout="vertical">
                            <Form.Item label="กำหนดค่าเริ่มต้นใหม่">
                                <Input
                                    type='number'
                                    name="max_stu"
                                    onChange={handleDefaultMaxStuChange}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;