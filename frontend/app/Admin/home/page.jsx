'use client'
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme,Input } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
const [selectedKey, setSelectedKey] = useState('1');

return (
    <Layout style={{height:"100vh"}}>
        <Sider trigger={null}  width={320} style={{background:"pink"}}>
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
                    <hr className='mt-5'></hr>
                </>
            
            <Menu
                style={{ background: "pink", marginTop: "20px" }}
                defaultSelectedKeys={[selectedKey]}
                mode="inline"
                onClick={(e) => setSelectedKey(e.key)}
                items={[
                    {
                        key: '1',
                        label: <span style={{ color: selectedKey === '1' ? 'black' : 'white' }}>จัดการการนัดหมาย</span>,
                    },
                    {
                        key: '2',
                        label: <span style={{ color: selectedKey === '2' ? 'black' : 'white' }}>ประกันอุบัติเหตุ</span>,
                    },
                    {
                        key: '3',
                        label: <span style={{ color: selectedKey === '3' ? 'black' : 'white' }}>การขอผ่อนผันการเข้ารับราชการทหาร</span>,
                    },
                    {
                        key: '4',
                        label: <span style={{ color: selectedKey === '4' ? 'black' : 'white' }}>การรับสมัครและรายงานตัวนักศึกษาวิชาทหาร</span>,
                    },
                    {
                        key: '5',
                        label: <span style={{ color: selectedKey === '5' ? 'black' : 'white' }}>บัตรทอง</span>,
                    },
                    {
                        key: '6',
                        label: <span style={{ color: selectedKey === '6' ? 'black' : 'white' }}>Health Insurance For Foreigner Student</span>,
                    },
                    {
                        key: '7',
                        label: <span style={{ color: selectedKey === '7' ? 'black' : 'white' }}>แบบคำขอรับเงินผ่านธนาคาร</span>,
                    }
                ]}
            />
        </Sider>
        <Layout>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            >
                <div className='flex ml-6 justify-between'>
                    <div className='mt-3 font-extrabold text-3xl'>
                        จัดการการนัดหมาย
                    </div>
                    <div className='mr-10'>
                        <Input style={{paddingRight:"100px"}} placeholder="ค้นหานิสิต" />;
                    </div>
                </div>
            </Header>
            <Content
                style={{
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                Content
            </Content>
        </Layout>
    </Layout>
);
};
export default App;