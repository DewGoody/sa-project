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
import { Button, Layout, Menu, theme, Input, Table, Space, Select, Modal, Form, Radio, message } from 'antd';
import axios from 'axios';
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
        if(name === 'newDate'){
            setEditingUser({ ...editingUser, [name]: new Date(value).toISOString() });
        }else{
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

                <Menu
                    style={{ background: "rgb(255,157,210)", marginTop: "20px" }}
                    defaultSelectedKeys={[selectedKey]}
                    mode="inline"
                    onClick={(e) => setSelectedKey(e.key)}
                    items={[
                        {
                            key: '1',
                            label: <span style={{ color: selectedKey === '1' ? 'black' : 'white' }}>จัดการการนัดหมาย</span>,
                            onClick: () => window.location.href = '/Admin/home/0'
                        },
                        {
                            key: '2',
                            label: <span style={{ color: selectedKey === '2' ? 'black' : 'white' }}>ประกันอุบัติเหตุ</span>,
                            onClick: () => window.location.href = '/Admin/prakan/0'
                        },
                        {
                            key: '3',
                            label: <span style={{ color: selectedKey === '3' ? 'black' : 'white' }}>การขอผ่อนผันการเข้ารับราชการทหาร</span>,
                            onClick: () => window.location.href = '/Admin/ponpan/0'
                        },
                        {
                            key: '4',
                            label: <span style={{ color: selectedKey === '4' ? 'black' : 'white' }}>การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร</span>,
                            onClick: () => window.location.href = '/Admin/rd/0'
                        },
                        {
                            key: '5',
                            label: <span style={{ color: selectedKey === '5' ? 'black' : 'white' }}>บัตรทอง</span>,
                            onClick: () => window.location.href = '/Admin/goldencard/page/0'
                        },
                        {
                            key: '6',
                            label: <span style={{ color: selectedKey === '6' ? 'black' : 'white' }}>Health Insurance For Foreigner Student</span>,
                            onClick: () => window.location.href = '/Admin/prakan-inter/0'
                        },
                        {
                            key: '7',
                            label: <span style={{ color: selectedKey === '7' ? 'black' : 'white' }}>จัดการจำนวนผู้เข้ารับบริการ</span>,
                            onClick: () => window.location.href = '/Admin/editMaxStudent'
                        },
                        {
                            key: '8',
                            label: <span style={{ color: selectedKey === '8' ? 'black' : 'white' }}>จัดการผู้ใช้งาน</span>,
                            onClick: () => window.location.href = '/Admin/user'
                        },
                        {
                            key: '9',
                            label: <span style={{ color: selectedKey === '9' ? 'black' : 'white' }}>เปิด-ปิดวันให้บริการ</span>,
                            onClick: () => window.location.href = '/Admin/editServiceDate'
                        }

                    ]}
                />
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
                    <div>
                        
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
                                                       // danger
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
                        <p>เลือกจำนวนนิสิตสูงสุดที่รองรับได้</p>
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
                            name="newDate"
                            value={editingUser?.newDate.split('T')[0]}
                            onChange={handleInputChange}
                        />
                        </Form.Item>
                        <Form.Item label="เลือกจำนวนนิสิตสูงสุดที่รองรับได้">
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
      title="ต้องการเปิดวันให้บริการใช่ไหม"
      visible={isDeleteModalVisible}
      onCancel={handleDeleteCancel}
      footer={[
        <Button key="cancel" onClick={handleDeleteCancel}>
          ปิดหน้าต่าง
        </Button>,
        <Button key="delete" type="primary" loading={loading} onClick={handleDeleteConfirm}>
          เปิดกลับมาให้บริการอีกครั้ง
        </Button>,
      ]}
    >
      <p>คุณต้องการจะเปิดวันนี้ให้กลับมาให้บริการได้อีกครั้งใช่ไหม</p>
    </Modal>

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppointmentManagement;