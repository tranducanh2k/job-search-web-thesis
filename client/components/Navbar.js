import Image from 'next/image'; 
import { useState } from 'react';
import {AiFillPhone, AiOutlineUser} from "react-icons/ai";
import {BsArrowLeft} from "react-icons/bs";
import {BiSolidBookAlt, BiSolidUser, BiLogOut} from "react-icons/bi";
import {GiHamburgerMenu} from "react-icons/gi";
import {FaBuilding} from "react-icons/fa";
import {IoMdArrowDropdown} from "react-icons/io";
import {RiLockPasswordLine} from "react-icons/ri";
import { Input, Button, Space, Form, Alert, message, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { checkCreatedEmployee, login, logout } from '../redux/authSlice';
import { useRouter } from 'next/router'
import {clearCookies, setLoginCookies} from '../utils/cookieHandler';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [form, setForm] = useState('login-form');
    const [showSignupAlert, setShowSignupAlert] = useState(false);
    const [signupAlertMessage, setSignupAlertMessage] = useState('');
    const [signupAlertType, setSignupAlertType] = useState('');
    const [showSigninAlert, setShowSigninAlert] = useState(false);

    const profileMenuItems = [
        {
            key: "1",
            icon: <BiSolidUser/>,
            label: (
                <a
                    rel="noopener noreferrer"
                    onClick={() => {
                        if(authState.currentUser.accountType === 'employee') {
                            router.push('/profile')
                        } else if(authState.currentUser.accountType === 'company') {
                            router.push('/company-profile')
                        }
                    }}
                >
                    Dashboard
                </a>
            ),
        },
        {
            key: "3",
            icon: <BiLogOut/>,
            label: (
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        router.push('/');
                        dispatch(logout());
                        clearCookies();
                        messageApi.open({
                            type: 'success',
                            content: 'Log out successfully!',
                        });
                    }}
                >
                    Log out
                </a>
            ),
        }
    ];
    
    const onFinishSignin = async (values) => {
        const response = await fetch(`${API_URL}/account/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                password: values.password
            })
        });
        const result = await response.json();
        if(response.status == 200) {
            dispatch(login(result.user));
            dispatch(checkCreatedEmployee(result.employeeId));
            setLoginCookies(result.token, result.user.accountId, result.employeeId, result.companyId);
            setShowLoginPopup(false);
            messageApi.open({
                type: 'success',
                content: 'Log in successfully!',
            });
        } else {
            setShowSigninAlert(true);
            setTimeout(() => setShowSigninAlert(false), 4000);
        }
    }
    const loginForm = <div id="login-form">
            <Form onFinish={onFinishSignin}>
                {showSigninAlert && <Alert style={{marginBottom:'8px'}} showIcon message='Wrong username or password' type='error' />}
                <Form.Item
                    name="username"
                    rules={[{
                        required: true,
                        message: 'Please input your username!',
                    }]}
                >
                    <Input placeholder="Username" prefix={<AiOutlineUser/>} size="large" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{
                        required: true,
                        message: 'Please input your password!',
                    }]}
                >
                    <Input.Password placeholder="Password" prefix={<RiLockPasswordLine/>} size="large" />
                </Form.Item>
                <Button type="primary" size="large" htmlType='submit' block>Login</Button>
                <Space>
                    <span>Not a member?</span>
                    <Button type='link' size='large' onClick={()=>setForm('select-role-form')}>Signup</Button>
                </Space>
            </Form>
        </div>

    const selectRoleForm = <div id="select-role-form">
            <Space direction='vertical' style={{width: '100%'}}>
                <Button type='text' onClick={()=>setForm('login-form')}><BsArrowLeft style={{fontSize: '20px'}}/></Button>
                <span>Who are you?</span>
                <Button size='large' block onClick={()=>setForm('employee-signup-form')}><BiSolidUser/>&nbsp;&nbsp;Employee</Button>
                <Button 
                    size='large' 
                    block onClick={()=>{
                        router.push('/signup');
                        setShowLoginPopup(false);
                        setForm('login-form');
                    }}
                >
                    <FaBuilding/>&nbsp;&nbsp;Company
                </Button>
            </Space>
        </div>

    const onFinishSignup = async (values) => {
        const response = await fetch(`${API_URL}/account/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
                accountType: 'employee'
            })
        });
        const result = await response.json();
        if(response.status == 200) {
            setShowSignupAlert(true);
            setSignupAlertMessage('You have signed up successfully!');
            setSignupAlertType('success');
            setTimeout(() => setShowSignupAlert(false), 5000);
        } else if (response.status == 404) {
            setShowSignupAlert(true);
            setSignupAlertMessage(result.message);
            setSignupAlertType('error');
            setTimeout(() => setShowSignupAlert(false), 5000);
        }
    };
    const employeeSignupForm = (
        <div id="employee-signup-form">
            <Form
                onFinish={onFinishSignup}
            >
                <Button type="text" onClick={() => setForm("select-role-form")}>
                    <BsArrowLeft style={{ fontSize: "20px" }} />
                </Button>
                <h2>Employee Sign Up</h2>
                {showSignupAlert && <Alert style={{marginBottom:'8px'}} message={signupAlertMessage} type={signupAlertType} showIcon />}
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input
                        placeholder="Username"
                        prefix={<AiOutlineUser />}
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Password"
                        prefix={<RiLockPasswordLine />}
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="re-enter"
                    rules={[
                        {
                            required: true,
                            message: "Please re-enter your password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        })
                    ]}
                    dependencies={['password']}
                    hasFeedback
                >
                    <Input.Password
                        placeholder="Re-enter password"
                        prefix={<RiLockPasswordLine />}
                        size="large"
                    />
                </Form.Item>
                <Space>
                    <span>Already a member?</span>
                    <Button
                        type="link"
                        size="large"
                        onClick={() => setForm("login-form")}
                    >
                        Login
                    </Button>
                </Space>
                <Button type="primary" size="large" block htmlType="submit">
                    Sign Up
                </Button>
            </Form>
        </div>
    );

    return <div id="navbar">
        {contextHolder}
        <div>
            <Image 
                src="/images/vecteezy_job-search-logo_8688110.jpg" 
                width="120px"
                height="110px"
                alt='logo'
                onClick={() => router.push('/')}
                style={{cursor: 'pointer'}}
            />
            <ul>
                <li><AiFillPhone/> 038.211.4388</li>
                <li><BiSolidBookAlt/> Contact us</li>
                <li>
                    <Image 
                        src="/images/Wikipedia-Flags-VN-Vietnam-Flag.512.png" 
                        width="30px"
                        height="30px"
                        alt='flag'
                    />
                </li>
            </ul>
        </div>
        <div>
            <div>
                <GiHamburgerMenu/>
                {
                    authState.currentUser?.accountType === 'company' && 
                    <a onClick={() => router.push('/employee')}>Find Employee</a>
                }
                <a onClick={() => router.push('/jobs')}>IT Jobs</a>
                <a onClick={() => router.push('/companies')}>IT Companies</a>
                {
                    authState.currentUser?.accountType === 'employee' && 
                    <a onClick={() => router.push('/profile/job-following')}>Jobs Following</a>
                }
                {
                    authState.currentUser?.accountType === 'employee' && <a>Recommended Jobs</a>
                }
            </div>
            <div>
                {authState.currentUser && authState.currentUser.username? 
                    <Dropdown menu={{items: profileMenuItems}} placement="bottomRight">
                        <a id='login-username'>
                            {authState.currentUser.accountType}:&nbsp;
                            {authState.currentUser.username}&nbsp;&nbsp;<IoMdArrowDropdown style={{transform:'scale(1.5)'}}/>
                        </a> 
                    </Dropdown>
                    : <button onClick={() => setShowLoginPopup(!showLoginPopup)}>Login</button>
                }
                {
                    showLoginPopup && 
                    <div id="login-popup">
                        {
                            form === 'login-form' && loginForm
                        }
                        {
                            form === 'select-role-form' && selectRoleForm
                        }
                        {
                            form === 'employee-signup-form' && employeeSignupForm
                        }
                    </div>
                }
            </div>
        </div>
    </div>
}