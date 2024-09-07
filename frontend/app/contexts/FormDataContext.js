'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FormDataContext = createContext();
export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [datafromapiprofile, setdatafromapiprofile] = useState({});
  const [datafromapimilitary, setdatafromapimilitary] = useState({});
  const [formData, setFormData] = useState({
    Nametitle: '',
    Name: '',
    Surname: '',
    citizenId: '',
    birthDate: '',
    religion: '',
    ethnicity: '',
    nationality: '',
    fatherName: '',
    motherName: '',
    occupation: '',
    domicileNumber: '',
    road: '',
    province: '',
    amphure: '',
    district: '',
    zipCode: '',
    militaryDomicileNumber: '',
    militaryProvince: '',
    militaryDistrict: '',
    militaryAmphure: '',
    grade9GPAX: '',
    school: '',
    schoolProvince: '',
    ParentName: '',
    Parentage: '',
    Parentjob: '',
    ParentworkAddress: '',
    Parentrelated: ''
  });

  const fetchdataapi = async () => {
    try {
      const response = await axios.get("/api/profile");
      setdatafromapiprofile(response.data);
      const responsemilitary = await axios.get("/api/military")
      setdatafromapimilitary(responsemilitary.data)
      console.log("API MILITARY",datafromapimilitary.data.parent_info.parent_fname)
      // console.log(response.data.title); 
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchdataapi();
  }, []);

  useEffect(() => {
    if (datafromapiprofile.bd) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);
      setFormData((prevData) => ({
        ...prevData,
        id:datafromapiprofile.id,
        Nametitle: datafromapiprofile.title,
        Name: datafromapiprofile.fnameTH,
        Surname: datafromapiprofile.lnameTH,
        citizenId: datafromapiprofile.thai_id,
        birthDate: formattedBirthDate,
        religion: datafromapiprofile.religion,
        ethnicity: datafromapiprofile.race,
        nationality: datafromapiprofile.nationality,
        
        fatherName: '',
        fatherSurname: '',
        motherName: '',
        motherSurname: '',

        occupation: '',
        domicileNumber: '',
        road: '',
        province: '',
        amphure: '',
        district: '',
        zipCode: '',
        militaryDomicileNumber: '', //RD1&2 
        militaryMoo:'', //RD2
        militarySoi:'', //RD2
        militaryProvince: '', //RD1&2
        militaryDistrict: '', //RD1&2
        militaryAmphure: '', //RD1&2
        grade9GPAX: '',
        school: '',
        schoolProvince: '',
        // military 2
        citizenRD:'',
        BeforeMilitartYear:'',
        YearBefore:'',
        Whereform:'',
        militaryProvince2: '',
        YearGradeRD: '',
        Yearregister:'',
        SelectedRD:"",
        OldRD:'',

        //U.data
        Collage_Year:'',
        Degrees:'',
        Major:'',
        Fristdata_in_U:"",
        FristMonth_in_U:"",
        in_Year:"",
       
        Parenttitle: '',
        ParentName: '',
        ParentSurname: '',

        Parentage: '',
        Parentjob: '',
        ParentworkAddress: '',
        Parentrelated: '',

        // rd2
        fatherNationality:'',
        fatherjob :'',
        fatherwherejob:"",
        fatherjobTST:'',
        fatherphone:'',
        fatherhome:'',
        fathermoo:'',
        fathersubdistrict:'',
        fatherdistrict:'',
        fatherprovince:'',
        fatherzipcode:'',
        fatherhomeTST:'',
        
        matherNationality:'',
        matherjob :'',
        matherwherejob:"",
        matherjobTST:'',
        matherphone:'',
        matherhome:'',
        mathermoo:'',
        mathersubdistrict:'',
        matherdistrict:'',
        matherprovince:'',
        matherzipcode:'',
        matherhomeTST:'',

        //RD2 การศึกษา บลาๆ
        RD2_Grade1 :'',
        RD2_Grade2 :'',
        RD2_Grade3 :'',
        RD2_Grade4 :'',
        RD2_Level1:'',
        RD2_Level2:'',
        RD2_Level3:'',
        RD2_Level4:'',
        RD2_Major1:'',
        RD2_Major2:'',
        RD2_Major3:'',
        RD2_Major4:'',
        RD2_Academy1:'',
        RD2_Academy2:'',
        RD2_Academy3:'',
        RD2_Academy4:'',

        //RD2 การฝึกพวกหัวเกรียน ประวัติการเรียนรด
        RD2_LevelRD1:'',
        RD2_LevelRD12:'',
        RD2_LevelRD2:'',
        RD2_LevelRD22:'',
        RD2_LevelRD3:'',
        RD2_LevelRD32:'',
        RD2_LevelRD4:'',
        RD2_LevelRD42:'',
        RD2_AcademyRD1:'',
        RD2_AcademyRD2:'',
        RD2_AcademyRD3:'',
        RD2_AcademyRD4:'',
        RD2_ProvinceRD1:'',
        RD2_ProvinceRD2:'',
        RD2_ProvinceRD3:'',
        RD2_ProvinceRD4:'',

        //RD2 ภูมิลำเนาทหาร
        





      }));
    }
  }, [datafromapiprofile]);

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};