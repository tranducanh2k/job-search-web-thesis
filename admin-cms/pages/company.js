import { useState } from "react";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { Button, Modal, message } from "antd";
import { getCookiesClientSide } from "../utils/cookieHandler";
import { Router, useRouter } from "next/router.js";

export default function Company(props) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false)
    const [info, setInfo] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const token = getCookiesClientSide('jwt');

    const handleActivate = async (accountId) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/create-or-update-company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                accountId: accountId,
                status: 'enabled'
            })
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/company')
        } else {
            messageApi.error(result.message);
        }
    }

    const handleModal = (company) => {
        setShowModal(true)
        setInfo(company)
    }

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/admin-delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/company')
        } else {
            messageApi.error(result.message);
        }
    }

    return <div id="company">
        {contextHolder}
        {
            <Modal
                title={`Company ${info.name} Information`}
                open={showModal}
                onCancel={()=> setShowModal(false)}
                onOk={()=> setShowModal(false)}
            >
                <div><span className="highlight">Name:</span> {info.name}</div>
                <div><span className="highlight">Email:</span> {info.email}</div>
                <div><span className="highlight">Country:</span> {info.country}</div>
                <div><span className="highlight">Province:</span> {info.province}</div>
                <div><span className="highlight">Website:</span> {info.website}</div>
                <div><span className="highlight">Company Size:</span> {info.companySize}</div>
                <div><span className="highlight">Description:</span> {info.description}</div>
                <div><span className="highlight">Industry:</span> {info.industry?.map(i => <span>{i}, </span>)}</div>
            </Modal>
        }
        <h1>Company</h1>
        <div>
            {
                props.companies.map(i => {
                    return <div className="company-item">
                        <div className="name" onClick={()=> handleModal(i)}>{i.name}</div>
                        <div>Status: {i.status}</div>
                        <Button danger onClick={()=> handleDelete(i._id)}>Delete</Button>
                        {
                            i.status == 'disabled' && 
                            <Button type="primary" onClick={()=> handleActivate(i.accountId)}>Activate</Button>
                        }
                    </div>
                })
            }
        </div>
    </div>
}

Company.Layout = MainLayout;

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
    
    return {
        props: {
            companies: resultCompany.company
        }
    }
}