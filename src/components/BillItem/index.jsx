import React, {useState,useEffect} from 'react';
import s from "./index.module.less";
import { Cell } from 'zarm';
import dayjs from "dayjs";
import CustomIcon from "../CustomIcon";
import { typeMap } from "@/utils";
import { useHistory } from "react-router-dom";

const BillItem = ({billItem}) => {
  const [expense,setExpense] = useState(0);
  const [income,setIncome] = useState(0);
  const history = useHistory();
  const goToDetail = () => {
    history.push('/detail')
  }
  useEffect(() => {
    const _expense = billItem.bills.filter((item)=>item.pay_type==2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
    const _income = billItem.bills.filter((item)=>item.pay_type==1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
  }, []);
  return(
    <div className={s.itemWrap}>
      <div className={s.header}>
        <div className={s.date}>{billItem.date}</div>
        <div className={s.typeTotal}>
          <span className={s.expenseTotal}>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{ expense.toFixed(2) }</span>
          </span>
          <span className={s.incomeTotal}>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{ income.toFixed(2) }</span>
          </span>
        </div>
      </div>
      <div className={s.content}>
      {
        billItem && billItem.bills.map(item => 
          <Cell
            className={s.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon
                  className={s.itemIcon}
                  type={item.type_id ? typeMap[item.type_id].icon : 1}
                />
                <span>{ item.type_name }</span>
              </>
            }
            description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
            help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
          >
          </Cell>)
        }
      </div>
    </div>
  )
}
export default BillItem

