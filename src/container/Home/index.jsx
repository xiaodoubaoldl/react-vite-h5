import React, { useState, useRef } from 'react';
import { Button, Icon } from "zarm";
import dayjs from "dayjs";
import s from "./index.module.less";
import PopupType from "@/components/PopupType";
import PopupDate from "@/components/PopupDate";
const Home = () => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncom, setTotalIncom] = useState(0);
  const [selectType, setSelectType] = useState({name:'全部类型',id:'all'});
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM'));
  const typeRef = useRef();
  const dateRef = useRef();
  const toggleDate = () => {
    dateRef.current.show();
  };
  const toggleType = () => {
    typeRef.current.show();
  };
  const selectedType = (param) => {
    setSelectType(param);
  };
  const onSelect = (param) => {
    setSelectDate(param);
  }
  return (
    <div className={s.index}>
      <div className={s.header}>
        <div className={s.headerTop}>
          <div className={s.expense}>总支出：<span>¥{totalExpense}</span></div>
          <div className={s.income}>总收入：<span>¥{totalIncom}</span></div>
        </div>
        <div className={s.headerBottom}>
          <div className={s.date} onClick={toggleDate}>{selectDate}<Icon className={s.arrow} type="arrow-bottom" /></div>
          <div className={s.type} onClick={toggleType}>{selectType.name}<Icon className={s.arrow} type="arrow-bottom" /></div>
        </div>
      </div>
      <PopupType ref={typeRef} selectedType={selectedType}/>
      <PopupDate ref={dateRef} onSelect={onSelect} mode={'month'}/>
    </div>
  )
}
export default Home;
