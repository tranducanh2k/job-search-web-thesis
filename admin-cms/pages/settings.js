import { Table, message, Button, Space, Input, Select } from "antd";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { useState } from "react";
import { useRouter } from "next/router.js";
const {TextArea} = Input;

export default function Settings(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [newpass, setNewpass] = useState('');
    const router = useRouter()
    const [accountList, setAccountList] = useState(props.accountList)
    const [accountId, setAccountId] = useState(props.accountList[0].accountId)
    const [content, setContent] = useState('');

    const handleSave = async () => {
        if(newpass) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/update-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'admin',
                    password: newpass
                })
            });
            let result = await response.json();
            if(response.status === 200) {
                messageApi.success(result.message);
            } else {
                messageApi.error(result.message);
            }
        }
    }

    const handleSend = async () => {
        if(content) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/create-noti`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountId: accountId,
                    content: content
                })
            });
            let result = await response.json();
            if(response.status === 200) {
                messageApi.success(result.message);
            } else {
                messageApi.error(result.message);
            }
        }
    }

    return <div id="settings">
        {contextHolder}
        <h1>Settings</h1>
        <div>
            <div className="update-pass noti">
                <span>Send notification to user</span>
                <Select
                    placeholder='Select account'
                    size="large"
                    onChange={(value) => setAccountId(value)}
                >
                    {
                        accountList.map(i => {
                            return <Option value={i.accountId}>{i.name}</Option>
                        })
                    }
                </Select>
                <TextArea
                    allowClear
                    value={content}
                    onChange={(e)=> setContent(e.target.value)}
                    rows={7}
                    placeholder="Notification content"
                    style={{width:'100%'}}
                />
                <Button type="primary" size="large" onClick={()=> handleSend()}>Send</Button>
            </div>
            <div className="update-pass">
                <span>Change admin password</span>
                <Input.Password
                    size="large"
                    placeholder="Enter new password"
                    value={newpass}
                    onChange={(e)=> setNewpass(e.target.value)}
                />
                <Button type="primary" size="large" onClick={()=> handleSave()}>Save</Button>
            </div>
        </div>
    </div>
}

Settings.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }

    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();

    const responseEmployee = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`, {
        method: 'GET'
    })
    const resultEmployee = await responseEmployee.json();

    let accountList = [];
    accountList.push(resultCompany.company);
    accountList.push(resultEmployee.employeeList)
    accountList = accountList.flat()
    
    return {
        props: {
            accountList
        }
    }
}