"use client"
import Image from "next/image";
const login = () => {
    return (
        <div className="h-screen">
            <div className="flex justify-center items-end h-1/6 ">
                <p className="text-3xl">กิจการนิสิต</p>
            </div>

            <div className="flex justify-center items-center h-4/6 space-x-6">
                <div className="h-5/6 w-3/12 shadow-center-lg rounded-3xl flex flex-col space-y-6 p-8 max-[700px]:w-9/12">
                    <h2 className="text-2xl text-center mb-4">เข้าสู่ระบบ</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-2 rounded-lg bg-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm">รหัสผ่าน</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 rounded-lg bg-gray-100"
                            />
                        </div>
                    </div>
                    <button className="w-full bg-pink-300 text-white py-3 rounded-xl hover:bg-pink-400 transition duration-200">
                        เข้าสู่ระบบ
                    </button>
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