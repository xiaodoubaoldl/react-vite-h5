import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon, Pull } from "zarm";
import dayjs from "dayjs";
import s from "./index.module.less";
import PopupType from "@/components/PopupType";
import PopupDate from "@/components/PopupDate";
import BillItem from "@/components/BillItem";
import Empty from "@/components/Empty";
import { get, REFRESH_STATE, LOAD_STATE } from "@/utils";
const Home = () => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [selectType, setSelectType] = useState({name:'全部类型',id:'all'});
  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1);
  const [billList, setBillList] = useState([]);
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  useEffect(()=>{
    getBillList();
  },[page,selectDate,selectType])
  // 获取billList
  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${selectDate}&type_id=${selectType.id || 'all'}`);
    // 下拉刷新，重制数据
    if (page == 1) {
      setBillList(data.list);
    } else {
      setBillList(billList.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);

  }
  const typeRef = useRef();
  const dateRef = useRef();
  const toggleDate = () => {
    dateRef.current.show();
  };
  const toggleType = () => {
    typeRef.current.show();
  };
  const selectedType = (param) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setSelectType(param);
  };
  const onSelect = (param) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setSelectDate(param);
  }
  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }
  return (
    <div className={s.index}>
      <div className={s.header}>
        <div className={s.headerTop}>
          <div className={s.expense}>总支出：<span>¥{totalExpense}</span></div>
          <div className={s.income}>总收入：<span>¥{totalIncome}</span></div>
        </div>
        <div className={s.headerBottom}>
          <div className={s.date} onClick={toggleDate}>{selectDate}<Icon className={s.arrow} type="arrow-bottom" /></div>
          <div className={s.type} onClick={toggleType}>{selectType.name}<Icon className={s.arrow} type="arrow-bottom" /></div>
        </div>
      </div>
      <div className={s.content}>
      {
        billList.length ? <Pull
          animationDuration={200}
          stayTime={400}
          refresh={{
            state: refreshing,
            handler: refreshData
          }}
          load={{
            state: loading,
            distance: 200,
            handler: loadData
          }}
        >
          {
            billList.map((item, index) => <BillItem
            billItem={item}
              key={index}
            />)
          }
        </Pull> : <Empty />
      }
        {/* {billList.map((item,key)=> <BillItem key={key} billItem={item}/>)} */}
      </div>
      <PopupType ref={typeRef} selectedType={selectedType}/>
      <PopupDate ref={dateRef} onSelect={onSelect} mode={'month'}/>
    </div>
  )
}
export default Home;
