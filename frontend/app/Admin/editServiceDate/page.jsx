'use client'
import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space, Form, Modal, Radio, message } from 'antd';
import axios from 'axios';
import Column from 'antd/es/table/Column';
import Menubar from '../component/menu';


const { Header, Sider, Content } = Layout;

const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};

const AppointmentManagement = () => {
    const [dataSource, setDataSource] = useState([]);
    const [stuData, setStuData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(null);
    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('9');
    const [statusRequest, setStatusRequest] = useState([]);
    const [shouldReload, setShouldReload] = useState(false);
    const [dateMaxStu, setDateMaxStu] = useState([])
    const [selectDate, setSelectDate] = useState();
    const [nameDate, setNameDate] = useState();

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

    const fetchGetDayoff = async () => {
        try {
            const res = await axios.post('/api/dayoff/getDayoff');
            console.log("res", res.data.data);
            setDataSource(res.data.data);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        }
    };

    useEffect(() => {
        fetchGetDayoff();
    }, []);

    console.log("datasource :", dataSource);
    console.log("selectDate", selectDate);
    console.log("nameDate", nameDate);
    console.log("value", value);

    const handleOk = async () => {
        setShouldReload(true);
        try {
            const res = await axios.post('/api/dayoff/create', {
                date: selectDate,
                period: value,
                name: nameDate
            });
            console.log("res", res);
        } catch (error) {
            console.error('Error editing max student:', error);
        } finally {
            setShouldReload(false);
        }
    };



    const handleSelectDate = async (date) => {
        const isoDate = new Date(date).toString() !== 'Invalid Date' ? new Date(date).toISOString() : '';
        setSelectDate(isoDate);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date') {
            setEditingUser({ ...editingUser, [name]: new Date(value).toISOString() });
        }
        else if (name === 'period') {
            setEditingUser({ ...editingUser, [name]: parseInt(value) });
        }
        else {
            setEditingUser({ ...editingUser, [name]: value });
        }
    };

    const handleEdit = (record) => {
        console.log("recordEdit", record);
        setEditingUser(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const handleDelete = (record) => {
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
            await axios.post("/api/dayoff/delete", { id: deletingUser.id });
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
            const response = await axios.post("/api/dayoff/update", editingUser);
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

    const columns = [
        {
            title: 'วันที่',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (text) => {
                const date = new Date(text);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                return <p>{formattedDate}</p>;
            }
        },
        {
            title: 'ช่วงเวลา',
            dataIndex: 'period',
            key: 'period',
            width: 200,
            render: (text, record) => {
                if (record.period === 0) {
                    return <p>ปิดบริการทั้งวัน</p>
                }
                else if (record.period === 1) {
                    return <p>ปิดบริการเฉพาะช่วงเช้า</p>
                }
                else {
                    return <p>ปิดบริการเฉพาะช่วงบ่าย</p>
                }

            }
        },
        {
            title: 'ชื่อ',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <p>{text}</p>
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
    ];

    return (
        <Layout style={{ height: "100%" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <div>
                    <div className="demo-logo-vertical" />
                    <div className='text-center mt-10 ml-3 mr-3'>
                        <p className='font-mono font-bold text-xl text-white'>
                            ฝ่ายทุนการศึกษาและบริการนิสิต
                        </p>
                        <p className='font-mono font-bold text-xl text-white'>
                            สำนักบริหารกิจการนิสิต
                        </p>
                        <p className='font-mono font-bold text-xl text-white'>
                            จุฬาลงกรณ์มหาวิทยาลัย
                        </p>
                    </div>
                    <div className='text-center mt-4 ml-3 mr-3'>
                        <p className='font-mono font-semibold text-white'>
                            Department of Scholarships & Student
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Services, Office of the Student Affairs,
                        </p>
                        <p className='font-mono font-semibold text-white'>
                            Chulalongkorn University
                        </p>
                    </div>
                    <div className="flex justify-center mt-5">
                        <hr
                            className="w-11/12"
                            style={{ borderTop: "5px solid white" }}
                        />
                    </div>
                </div>

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
                    <div>
                        <div className='flex mb-5 justify-between'>
                            <div className='font-extrabold text-3xl'>
                                เพิ่มช่วงเวลาปิดให้บริการ
                            </div>
                        </div>




                        <div className=' w-3/12'>
                            <p className='font-semibold text-xl mb-2'>รายละเอียด</p>
                            <Input
                                placeholder="รายละเอียด"
                                onChange={(e) => setNameDate(e.target.value)}
                            />
                        </div>

                        <div className='mt-5 w-3/12'>
                            <p className='font-semibold text-xl mb-2'>วันที่</p>
                            <Input
                                type="date"
                                onChange={(e) => handleSelectDate(e.target.value)}

                            />
                        </div>

                        <div className="mt-4 w-3/12">
                            <p className='font-bold text-xl mb-2'>ช่วงเวลา</p>
                            <Radio.Group style={style} onChange={onChange} value={value}>
                                <Radio value={0}>ทั้งวัน</Radio>
                                <Radio value={1}>ช่วงเช้า</Radio>
                                <Radio value={2}>ช่วงบ่าย</Radio>
                            </Radio.Group>
                            <div className='mt-5'>
                                <Button type='primary' onClick={handleOk}>
                                    บันทึก
                                </Button>
                            </div>
                        </div>


                        <div className='mt-10'>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                // loading = {loading}
                                style={{ borderRadius: borderRadiusLG }}
                                scroll={{ x: 'max-content' }}
                                bordered

                            />
                        </div>
                        <div className='mt-20'>

                        </div>


                    </div>

                    <Modal
                        title="แก้ไขวันปิดให้บริการ"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="cancel" onClick={handleCancel}>
                                ปิดหน้าต่าง
                            </Button>,
                            <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                                แก้ไข
                            </Button>,
                        ]}
                    >
                        <Form form={formEdit} layout="vertical">

                            <Form.Item label="วันที่">
                                <Input
                                    type='date'
                                    name="date"
                                    disabled
                                    value={editingUser?.date.split('T')[0]}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item label="ช่วงเวลา">
                                <Radio.Group style={style} onChange={handleInputChange} name='period' value={editingUser?.period}>
                                    <Radio value={0}>ปิดบริการทั้งวัน</Radio>
                                    <Radio value={1}>ปิดบริการเฉพาะช่วงเช้า</Radio>
                                    <Radio value={2}>ปิดบริการเฉพาะช่วงบ่าย</Radio>
                                </Radio.Group>


                            </Form.Item>
                            <Form.Item label="ชื่อ">
                                <Input
                                    name="name"
                                    value={editingUser?.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="ต้องการจะลบวันที่ปิดให้บริการใช่ไหม"
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
                        <p>คุณต้องการจะลบวันที่ให้บริการนี้ใช่ไหม</p>
                    </Modal>

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;