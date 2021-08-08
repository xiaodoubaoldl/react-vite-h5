import React, { useState, useEffect } from 'react'
import './App.css'
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom"
import routes from '../src/router'
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import NavBar from "@/components/NavBar";
// import 'zarm/dist/zarm.css';

function App() {
  const { pathname } = useLocation();
  const [ showNav, setShowNav ] = useState(false);
  useEffect(() => {
    setShowNav(['/','/data','/user'].includes(pathname));
  }, [pathname]);
  return (
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
      <>
        <Switch>
          {
            routes.map((item) => {
              return (
                <Route exact path={item.path} component={item.component} key={item.path}></Route>
              )
            })
          }
        </Switch>
        <NavBar showNav={showNav} />
      </>
      </ConfigProvider>
  )
}

export default App
