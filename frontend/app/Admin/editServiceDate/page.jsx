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
import { Button, Layout, Menu, theme, Input, Table, Space, Form, Modal,Radio, message } from 'antd';
import axios from 'axios';
import Column from 'antd/es/table/Column';


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
        if(name === 'date'){
            setEditingUser({ ...editingUser, [name]: new Date(value).toISOString() });
        }
        else if(name === 'period'){
            setEditingUser({ ...editingUser, [name]: parseInt(value) });
        }
        else{
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
            render: (text,record) => {
                if(record.period === 0){
                    return <p>ปิดบริการทั้งวัน</p>
                }
                else if(record.period === 1){
                    return <p>ปิดบริการเฉพาะช่วงเช้า</p>
                }
                else{
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
            title: 'แก้ไข / เปิดวันให้บริการ',
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
                        เปิดวันให้บริการ
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
                    }}
                >
                    <div>
                    <div className='flex mb-5 justify-between'>
                        <div className='font-extrabold text-3xl'>
                            เปิด-ปิดวันให้บริการ
                        </div>
                    </div>
                    <div>
                         <Table
                            dataSource={dataSource}
                            columns={columns}
                            // loading = {loading}
                            style={{ borderRadius: borderRadiusLG  }}
                            scroll={{ x: 'max-content' }}
                            bordered
                                                
                        />
                    </div>
                    <div className='w-3/12'>
                        <p className='font-bold text-xl mb-2'>เลือกวันที่จะปิดให้บริการ</p>
                        <Input
                            type="date"
                            onChange={(e) => handleSelectDate(e.target.value)}

                        />
                    </div>
                    <div className='mt-4 w-3/12'>
                        <p className='font-bold text-xl mb-2'>ชื่อวันที่</p>
                        <Input
                            placeholder="ชื่อวันที่"
                            onChange={(e) => setNameDate(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 w-3/12">
                        <p className='font-bold text-xl mb-2'>เลือกช่วงที่จะปิดการให้บริการ</p>
                        <Radio.Group style={style} onChange={onChange} value={value}>
                            <Radio value={0}>ปิดบริการทั้งวัน</Radio>
                            <Radio value={1}>ปิดบริการเฉพาะช่วงเช้า</Radio>
                            <Radio value={2}>ปิดบริการเฉพาะช่วงบ่าย</Radio>
                        </Radio.Group>
                        <div className='mt-5'>
                            <Button type='primary' onClick={handleOk}>
                                ปิดวันให้บริการ
                            </Button>
                        </div>
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