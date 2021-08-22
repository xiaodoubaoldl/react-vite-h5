import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import Captcha from "react-captcha-code";
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import s from "./style.module.less";
import CustomIcon from "@/components/CustomIcon";
import { post } from "@/utils";

const Login = () => {
  const captchaRef = useRef();
  const [ type, setType ] = useState('login');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ verify, setVerify ] = useState('');
  const [ captcha, setCaptcha ] = useState('');
  const handleChange = (captcha) => {
    setCaptcha(captcha);
  };
  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type]);
  // 提交
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type == 'login') {
        const { data } = await post('/api/user/login', {
          username,
          password
        });
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
        const { data } = await post('/api/user/register', {
          username,
          password
        });
        Toast.show('注册成功');
         setType('login');
      }
    } catch (error) {
      Toast.show('系统错误');
    }
  };
  return (
    <div className={s.auth}>
      <div className={s.header}/>
      <div className={s.tab}>
        <span className={cx({[s.active]: type=='login'})} onClick={() => setType('login')}>登录</span>
        <span className={cx({[s.active]: type=='register'})} onClick={() => setType('register')}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {
          type == 'register' ?
            <Cell icon={<CustomIcon type="mima" />}>
              <Input
                clearable
                type="text"
                placeholder="请输入验证码"
                onChange={(value) => setVerify(value)}
              />
              <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
            </Cell>
            : null
        }
      </div>
      <div className={s.operation}>
        {
          type == 'register' ? 
          <div className={s.agree}>
            <Checkbox />
            <label className="text-light">阅读并同意<a>《条款》</a></label>
          </div> : null
        }
        <Button onClick={onSubmit} block theme="primary">{type == 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}

export default Login;