'use client'
import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, theme, Input, Table, Space,Select, Form, message, Modal} from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from "next/image";



const login = () => {
    const [dataSource, setDataSource] = useState([]);
    const router = useRouter();
   

    const onFinish = async (values) => {
        console.log("Received values:", values);
        try {
            const response = await axios.post("/api/user/login", values);
            console.log("Login response:", response);
    
            if (response.data.data) {
                message.success("Login successful!");
                router.push("/Admin/home/0");
            } else {
                message.error("Login failed. Please check your username and password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            console.log.error("Login error:", error);
            message.error("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="h-screen">
            <div className="flex justify-center items-end h-1/6 ">
                <p className="text-3xl">กิจการนิสิต</p>
            </div>

            <div className="flex justify-center items-center h-4/6 space-x-6">
                <div className="h-5/6 w-3/12 shadow-center-lg rounded-3xl flex flex-col space-y-6 p-8 max-[700px]:w-9/12">
                    <h2 className="text-2xl text-center mb-4">เข้าสู่ระบบ</h2>
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        htmlType="submit"
                        className="space-y-4"
                    >
                        <Form.Item
                            label="ชื่อผู้ใช้"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="Username" className="w-full px-4 py-2 rounded-lg bg-gray-100" />
                        </Form.Item>

                        <Form.Item
                            label="รหัสผ่าน"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" className="w-full px-4 py-2 rounded-lg bg-gray-100" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full bg-pink-300 text-white py-3 rounded-xl hover:bg-pink-400 transition duration-200">
                                เข้าสู่ระบบ
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className=" h-5/6 w-5/12 shadow-center-lg rounded-3xl items-center place-content-center flex  max-[700px]:hidden">
                    <div className="bg-pink-300 h-5/6 w-10/12 rounded-2xl flex place-content-center items-center">
                        <img src="../Office of Student Affairs_0.png"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default login