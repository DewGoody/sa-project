import * as React from "react";
export const Header = () => {
    return (
      <header className="bg-pink-100 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/path/to/logo.png" alt="Logo" className="h-12 mr-4" />
            <div>
              <h1 className="text-xl font-bold text-pink-600">ฝ่ายทุนการศึกษาและบริการนิสิต</h1>
              <p className="text-gray-700">Department of Scholarships & Students Service</p>
              <p className="text-gray-700">Office of the Student Affairs, Chulalongkorn University</p>
            </div>
          </div>
        </div>
      </header>
    );
  }
  
