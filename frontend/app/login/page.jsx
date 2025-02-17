"use client"

import { useEffect } from 'react';
import axios from 'axios';

const login = () => {
    useEffect(() => {
        // เรียก API logout เพื่อเคลียร์คุกกี้เมื่อเข้าหน้า login
        axios.get('/api/user/logout')
          .then(response => {
            console.log('Logged out and cookies cleared');
          })
          .catch(error => {
            console.error('Error logging out:', error);
          });
      }, []);
    return (
        <div className="h-screen">
            <div className="flex justify-center items-end h-1/6 ">
                <p className="text-3xl">กิจการนิสิต</p>
            </div>

            <div className="flex justify-center items-center h-4/6 space-x-6">
                <div className=" h-5/6 w-3/12 shadow-center-lg rounded-3xl flex flex-col items-center space-y-3 place-content-center max-[700px]:w-9/12">
                    <div className="w-3/4 h-14 ">
                        <a href="/login/Admin" className="w-full h-full bg-pink-300 flex items-center justify-center rounded-2xl">เข้าสู่ระบบสำหรับเจ้าหน้าที่</a>
                        {/* Login page admin */}
                    </div>
                    <div className="w-3/4 h-14">
                        <a href="https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv" className="w-full h-full bg-pink-400 flex items-center justify-center rounded-2xl">เข้าสู่ระบบสำหรับนิสิต</a>
                        {/* SSO */}
                    </div>
                </div>
                <div className=" h-5/6 w-5/12 shadow-center-lg rounded-3xl items-center place-content-center flex max-[700px]:hidden">
                    <div className="bg-pink-300 h-5/6 w-10/12 rounded-2xl flex place-content-center items-center">
                        <img src="Office of Student Affairs_0.png"></img>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default login