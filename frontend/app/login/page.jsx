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

            </div>

            <div className="flex justify-center items-center h-4/6 space-x-6">
                <div className=" h-5/6 w-3/12 shadow-center-lg rounded-3xl flex flex-col items-center space-y-3 place-content-center max-[700px]:w-9/12">
                    <div className='mb-10'>
                        <p className="text-2xl font-semibold">เข้าสู่ระบบ</p>
                        <p className="text-2xl font-semibold">(Login)</p>
                    </div>
                    <div className="w-3/4 h-14 ">
                        <a href="/login/Admin" className="w-full h-full p-8 bg-pink-400 flex items-center justify-center rounded-2xl font-semibold text-white">
                            <div>
                                <p className=''>เข้าสู่ระบบสำหรับเจ้าหน้าที่</p>
                                <p className="text-sm">(Staff login)</p>
                            </div>
                        </a>
                        {/* Login page admin */}
                    </div>
                    <div className="w-3/4 h-14">

                        {/* SSO */}

                        {/* <a href="https://cunex-auth.azurewebsites.net/?partnerid=cuserv" className="mt-8 w-full h-full p-8 bg-pink-400  flex flex-col items-center justify-center space-y-4 rounded-2xl font-semibold text-white"> */}
                        <a href="https://cunex-auth-uat.azurewebsites.net/?partnerid=cuserv" className="mt-8 w-full h-full p-8 bg-pink-400  flex flex-col items-center justify-center space-y-4 rounded-2xl font-semibold text-white">

                            <div>
                                <p className=''>เข้าสู่ระบบสำหรับนิสิต</p>
                                <p className="text-sm">(Student login)</p>
                            </div>
                        </a>

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