'use client'
import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, Table, Space } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState('1');
    const columns = [
        {
            title: 'ชื่อ-นามสกุล',
            dataIndex: 'fullname',
        },
        {
            title: 'รหัสนิสิต',
            dataIndex: 'student_ID',
        },
        {
            title: 'เบอร์โทรศัพท์',
            dataIndex: 'phone_num',
        },
        {
            title: 'วันที่เข้ายื่นเอกสาร',
            dataIndex: 'applydate',
        },
        {
            title: 'status',
            dataIndex: 'status',
        },
        {
            title: 'บริการ',
            dataIndex: 'service',
        },
        {
            title: '',
            align: 'right', // เพิ่ม align ขวา
            render: (_, record) => (
                <Space size="middle">

                    <a>Delete</a>
                </Space>
            ),
        },



    ];
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider trigger={null} width={320} style={{ background: "rgb(255,157,210)" }}>
                <>
                    <div className="demo-logo-vertical" />
                    <div className='mt-5 ml-3'>
                        <p className='font-mono font-bold text-xl text-white'>
                            ฝ่ายทุนการศึกษาและบริการนิสิตสำนักบริหารกิจการนิสิตจุฬาลงกรณ์มหาวิทยาลัย
                        </p>
                    </div>
                    <div className='ml-3 mt-3'>
                        <p className='font-mono font-medium text-white'>
                            Departmet of Scholarship & Students Service, Office of the Student Affairs, Chulalongkorn University
                        </p>
                    </div>
                    <div className="flex justify-center mt-5">
                        <hr
                            className="w-11/12"
                            style={{ borderTop: "5px solid white" }}
                        />
                    </div>
                </>

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
                        <div className=' font-extrabold text-3xl'>
                            จัดการการนัดหมาย
                        </div>
                        <div className='mr-10'>
                            <Input style={{ paddingRight: "100px" }} placeholder="ค้นหานิสิต" />
                        </div>
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                        }
                    />

                </Content>
            </Layout>
        </Layout>
    );
};
export default App;