import { Table, message, Button, Space, Input } from "antd";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { useState } from "react";
import { useRouter } from "next/router.js";

export default function Cert({certs}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [certInput, setCertInput] = useState('')
    const router = useRouter()

    const handleAdd = async () => {
        if(certInput) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cert/create`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({certName: certInput})
            });
            let result = await response.json();
            if(response.status === 200) {
                messageApi.success(result.message);
                router.push('/certificate');
            } else {
                messageApi.error(result.message);
            }
        }
    }
    const hanldeDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cert/delete/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/certificate');
        } else {
            messageApi.error(result.message);
        }
    }

    const columns = [
        {
            title: "Certificate Name",
            key: "cert",
            dataIndex: "cert",
            render: (_, { cert }) => (
                <div>{cert}</div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, {key}) => (
                <Space size="middle">
                    <a onClick={()=> hanldeDelete(key)}>Delete</a>
                </Space>
            ),
        },
    ];
    const data = certs.map(i => {
        return {
            key: i._id,
            cert: i.certName
        }
    })

    return <div id="skill">
        <h1>Certificate</h1>
        {contextHolder}
        <div className="add-skill">
            <Input value={certInput} onChange={(e)=>setCertInput(e.target.value)} placeholder="Write new cert name" size="large4" />
            <Button 
                type="primary" 
                size="large"
                onClick={() => handleAdd()}
            >
                Add this cert
            </Button>
        </div>
        <Table columns={columns} dataSource={data} />
    </div>
}

Cert.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cert`, {
        method: 'GET'
    })
    const result = await response.json();
    
    return {
        props: {
            certs: result.certs
        }
    }
}