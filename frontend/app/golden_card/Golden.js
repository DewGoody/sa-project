'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const Golden = createContext();
export const useGoldenContext = () => useContext(Golden);

export const GoldenDataProvider = ({ children }) => {
  const [Data, setData] = useState({});
  const [datafromapiprofile, setdatafromapiprofile] = useState({});

  const fetchdataapi = async () => {
    try {
      const response = await axios.get("/api/profile");
      setdatafromapiprofile(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchdataapi();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle null or undefined dates
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (Object.keys(datafromapiprofile).length > 0) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);
      setData((prevData) => ({
        ...prevData,
        id: datafromapiprofile.id,
        Nametitle: datafromapiprofile.title,
        Name: datafromapiprofile.fnameTH,
        Surname: datafromapiprofile.lnameTH,
        citizenId: datafromapiprofile.thai_id,
        birthDate: formattedBirthDate,
      }));
    }
  }, [datafromapiprofile]);

  const updateData = (newData) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <Golden.Provider value={{ Data, updateData }}>
      {children}
    </Golden.Provider>
  );
};
