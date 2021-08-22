import React, {useState,forwardRef, useEffect} from 'react';
import { Popup, Icon } from "zarm";
import cx from "classnames";
import s from "./index.module.less";
import { get } from '@/utils'
const PopupType = forwardRef(({selectedType},ref) => {
  const [isShow, setIsShow] = useState(false);
  const [currentType, setCurrentType] = useState({name:'全部类型',id:'all'});
  const [expenseTypeArr, setExpenseTypeArr] = useState([]);
  const [incomeTypeArr, setIncomeTypeArr] = useState([]);
  useEffect(async () => {
    // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
    const { data: { list } } = await get('/api/type/list')
    setExpenseTypeArr(list.filter(i => i.type == 1))
    setIncomeTypeArr(list.filter(i => i.type == 2))
  }, []);

  if (ref) {
    ref.current = {
      show: () => {
        setIsShow(true);
      },
      close: () => {
        setIsShow(false);
      }
    }
  };
  const chooseType = (param) => {
    setCurrentType(param);
    setIsShow(false);
    selectedType(param);
  }
  return (
    <Popup
        visible={isShow}
        direction="bottom"
        onMaskClick={() => setIsShow(false)}
        destroy={false}
        mountContainer={() => document.body}
      >
      <div className={s.popupTypeContent}>
        <div className={s.header}>请选择类型<Icon type="wrong" className={s.close} onClick={() => setIsShow(false)} /></div>
        <div className={s.content}>
          <div className={cx({ [s.typeItem]: true, [s.active]: currentType.id == 'all' })} onClick={()=>chooseType({id:'all',name:'全部类型'})}>全部类型</div>
          <div style={{marginBottom:10}}>支出</div>
          <div className={s.typeWrap}>
            {
              expenseTypeArr.map((item,key)=>{
                return (
                  <p className={cx({ [s.typeItem]: true, [s.active]: currentType.id == item.id })} key={key} onClick={()=>chooseType(item)}>{item.name}</p>
                )
              })
            }
          </div>
          <div style={{marginBottom:10}}>收入</div>
          <div className={s.typeWrap}>
            {
              incomeTypeArr.map((item, key)=>{
                return (
                  <p className={cx({ [s.typeItem]: true, [s.active]: currentType.id == item.id })} key={key} onClick={()=>chooseType(item)}>{item.name}</p>
                )
              })
            }
          </div>
        </div>
      </div>
    </Popup>
  )
})
export default PopupType;
