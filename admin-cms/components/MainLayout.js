import { Avatar, Input } from "antd";
import { useRouter } from "next/router";
import {AiFillDashboard,AiFillMessage} from 'react-icons/ai'
import {BsFillBriefcaseFill,BsFillBuildingFill} from 'react-icons/bs'
import {FaCertificate, FaCog,FaUserAlt} from 'react-icons/fa'
import {UserOutlined} from '@ant-design/icons'
import {BiLogOut} from 'react-icons/bi'
import { useState } from "react";
import { clearCookies } from "../utils/cookieHandler.js";

export default function MainLayout({children}) {
    const router = useRouter()

    return <div id="main-layout">
        <div className="navbar">
            <div className="logo"></div>
            <div>
                <div 
                    className={`nav-items ${router.pathname.includes('/dashboard')? 'cur' : ''}`}
                    onClick={()=> router.push('/dashboard')}
                >
                    <AiFillDashboard/> Dashboard
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/company')? 'cur' : ''}`}
                    onClick={()=> router.push('/company/company-signup')}
                >
                    <BsFillBuildingFill/> Company
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/employee')? 'cur' : ''}`}
                    onClick={()=> router.push('/employee')}
                >
                    <FaUserAlt/> Employee
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/interview')? 'cur' : ''}`}
                    onClick={()=> router.push('/interview')}
                >
                    <AiFillMessage/> Interview
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/skill')? 'cur' : ''}`}
                    onClick={()=> router.push('/skill')}
                >
                    <BsFillBriefcaseFill/> Skill
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/certificate')? 'cur' : ''}`}
                    onClick={()=> router.push('/certificate')}
                >
                    <FaCertificate/> Certificate
                </div>
                <div 
                    className={`nav-items ${router.pathname.includes('/settings')? 'cur' : ''}`}
                    onClick={()=> router.push('/settings')}
                >
                    <FaCog/> Settings
                </div>
                <div className="nav-items" onClick={()=> {
                    clearCookies();
                    router.push('/')
                }}>
                    <BiLogOut/> Log Out
                </div>
            </div>
        </div>
        <div>
            <header>
                <Avatar size={50} icon={<UserOutlined/>} style={{cursor:'pointer'}} />
            </header>
            <div className="body-content">
                {children}
            </div>
        </div>
    </div>
}