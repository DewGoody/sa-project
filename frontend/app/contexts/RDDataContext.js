'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FormDataContext = createContext();
export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [datafromapiprofile, setdatafromapiprofile] = useState({});
  const [datafromapimilitary, setdatafromapimilitary] = useState({});
  const [formData, setFormData] = useState({});

  const fetchdataapi = async () => {
    try {
      const response = await axios.get("/api/profile");
      setdatafromapiprofile(response.data);

      const responsemilitary = await axios.get("/api/military")
      // console.log(responsemilitary.data)
      await setdatafromapimilitary(responsemilitary.data)
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
  // console.log("API MILITARY",datafromapimilitary.mother_info?.fname)


  useEffect(() => {
    fetchdataapi();
  }, []);

  useEffect(() =>{
 console.log(datafromapimilitary.Military_info)
  },[datafromapimilitary])
  useEffect(() => {

    if (datafromapiprofile.bd) {
      const formattedBirthDate = formatDate(datafromapiprofile.bd);
      setFormData((prevData) => ({
        ...prevData,
        id: datafromapiprofile.id,
        Nametitle: datafromapiprofile.title,
        Name: datafromapiprofile.fnameTH,
        Surname: datafromapiprofile.lnameTH,
        citizenId: datafromapiprofile.thai_id,
        birthDate: formattedBirthDate,
        religion: datafromapiprofile.religion,
        ethnicity: datafromapiprofile.race,
        nationality: datafromapiprofile.nationality,

        fatherName: datafromapimilitary.father_mother_info?.father.fname,
        fatherSurname: datafromapimilitary.father_mother_info?.father.lname,
        motherName: datafromapimilitary.father_mother_info?.mother.fname,
        motherSurname: datafromapimilitary.father_mother_info?.mother.lname,
        occupationfather: datafromapimilitary.father_mother_info?.father.occupation,
        occupationmother: datafromapimilitary.father_mother_info?.mother.occupation,

        domicileNumber: datafromapimilitary.addresses?.DOPA_address.house_num,
        road: datafromapimilitary.addresses?.DOPA_address.street,
        province: datafromapimilitary.addresses?.DOPA_address.province,
        amphure: datafromapimilitary.addresses?.DOPA_address.subdistrict,
        district: datafromapimilitary.addresses?.DOPA_address.district,
        zipCode: datafromapimilitary.addresses?.DOPA_address.postal_code,

        militaryDomicileNumber: datafromapimilitary.addresses?.Military_address.house_num, //RD1&2 
        militaryMoo: '', //RD2
        militarySoi: '', //RD2
        militaryProvince: datafromapimilitary.addresses?.Military_address.province, //RD1&2
        militaryDistrict: datafromapimilitary.addresses?.Military_address.district, //RD1&2
        militaryAmphure: datafromapimilitary.addresses?.Military_address.subdistrict, //RD1&2

        grade9GPAX: datafromapimilitary.Military_info?.grade9_gpax,
        school: datafromapimilitary.Military_info?.grade9_school,
        schoolProvince: datafromapimilitary.Military_info?.grade9_province,
        // military 2
        citizenRD: '',
        BeforeMilitartYear: '',
        YearBefore: '',
        Whereform: '',
        militaryProvince2: '',
        YearGradeRD: '',
        Yearregister: '',
        SelectedRD: "",
        OldRD: '',

        //U.data
        Collage_Year: '',
        Degrees: '',
        Major: '',
        Fristdata_in_U: "",
        FristMonth_in_U: "",
        in_Year: "",

        Parenttitle: datafromapimilitary.guardian_info?.guardian_title,
        ParentName: datafromapimilitary.guardian_info?.guardian_fname,
        ParentSurname: datafromapimilitary.guardian_info?.guardian_lname,

        Parentage: datafromapimilitary.guardian_info?.guardian_age,
        Parentjob: datafromapimilitary.guardian_info?.guardian_occupation,
        ParentworkAddress: datafromapimilitary.guardian_info?.guardian_address,
        Parentrelated: datafromapimilitary.guardian_info?.guardian_relation,

        // rd2
        fatherNationality: '',
        fatherjob: '',
        fatherwherejob: "",
        fatherjobTST: '',
        fatherphone: '',
        fatherhome: '',
        fathermoo: '',
        fathersubdistrict: '',
        fatherdistrict: '',
        fatherprovince: '',
        fatherzipcode: '',
        fatherhomeTST: '',

        matherNationality: '',
        matherjob: '',
        matherwherejob: "",
        matherjobTST: '',
        matherphone: '',
        matherhome: '',
        mathermoo: '',
        mathersubdistrict: '',
        matherdistrict: '',
        matherprovince: '',
        matherzipcode: '',
        matherhomeTST: '',

        //RD2 การศึกษา บลาๆ
        RD2_Grade1: '',
        RD2_Grade2: '',
        RD2_Grade3: '',
        RD2_Grade4: '',
        RD2_Level1: '',
        RD2_Level2: '',
        RD2_Level3: '',
        RD2_Level4: '',
        RD2_Major1: '',
        RD2_Major2: '',
        RD2_Major3: '',
        RD2_Major4: '',
        RD2_Academy1: '',
        RD2_Academy2: '',
        RD2_Academy3: '',
        RD2_Academy4: '',

        //RD2 การฝึกพวกหัวเกรียน ประวัติการเรียนรด
        RD2_LevelRD1: '',
        RD2_LevelRD12: '',
        RD2_LevelRD2: '',
        RD2_LevelRD22: '',
        RD2_LevelRD3: '',
        RD2_LevelRD32: '',
        RD2_LevelRD4: '',
        RD2_LevelRD42: '',
        RD2_AcademyRD1: '',
        RD2_AcademyRD2: '',
        RD2_AcademyRD3: '',
        RD2_AcademyRD4: '',
        RD2_ProvinceRD1: '',
        RD2_ProvinceRD2: '',
        RD2_ProvinceRD3: '',
        RD2_ProvinceRD4: '',

        //RD2 ภูมิลำเนาทหาร ใช่อันเดิม
        
        // การเป็นทหารกองหนุน
        Branches:'',
        crops:'',
        military_rank:"",
        military_rank1:"",
        crops_rank:'',
        crops_rank1:'',
        command_rank:'',
        command_rank1:'',
        date_rank1:"",
        date_rank:"",



      }));
    }
  }, [datafromapiprofile, datafromapimilitary]);

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