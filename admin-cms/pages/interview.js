import { useState } from "react";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { Button, Modal, message } from "antd";
import { getCookiesClientSide } from "../utils/cookieHandler";
import { Router, useRouter } from "next/router.js";

export default function Interview(props) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false)
    const [info, setInfo] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const token = getCookiesClientSide('jwt');

    const handleModal = (interview) => {
        setShowModal(true)
        setInfo(interview)
    }

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin-delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/interview')
        } else {
            messageApi.error(result.message);
        }
    }

    return <div id="company">
        {contextHolder}
        {
            <Modal
                title={`Interview Information`}
                open={showModal}
                onCancel={()=> setShowModal(false)}
                onOk={()=> setShowModal(false)}
            >
                <div><span className="highlight">Company:</span> {info.companyId?.name}</div>
                <div><span className="highlight">Employee:</span> {info.employeeId?.name}</div>
                <div><span className="highlight">Interview date:</span> {info.interviewDate}</div>
                <div><span className="highlight">Note:</span> {info.note}</div>
            </Modal>
        }
        <h1>Interview</h1>
        <div>
            {
                props.interview?.map(i => {
                    return <div className="company-item" >
                        <div onClick={()=> handleModal(i)}>
                            <div className="name">Company: {i.companyId.name}</div>
                            <div className="name">Employee: {i.employeeId.name}</div>
                        </div>
                        <Button danger onClick={()=> handleDelete(i._id)}>Delete</Button>
                    </div>
                })
            }
        </div>
    </div>
}

Interview.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }

    const responseInterview = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'GET'
    })
    const resultInterview = await responseInterview.json();
    
    return {
        props: {
            interview: resultInterview.interview
        }
    }
}