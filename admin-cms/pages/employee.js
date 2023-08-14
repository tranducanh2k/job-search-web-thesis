import { useState } from "react";
import MainLayout from "../components/MainLayout.js"
import cookies from "next-cookies";
import { Button, Modal, message } from "antd";
import { getCookiesClientSide } from "../utils/cookieHandler";
import { Router, useRouter } from "next/router.js";

export default function Employee(props) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false)
    const [info, setInfo] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const token = getCookiesClientSide('jwt');

    const handleModal = (employee) => {
        setShowModal(true)
        setInfo(employee)
    }

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/admin-delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        if(response.status === 200) {
            messageApi.success(result.message);
            router.push('/employee')
        } else {
            messageApi.error(result.message);
        }
    }

    return <div id="company">
        {contextHolder}
        {
            <Modal
                title={`Employee ${info.name} Information`}
                open={showModal}
                onCancel={()=> setShowModal(false)}
                onOk={()=> setShowModal(false)}
            >
                <div><span className="highlight">Name:</span> {info.name}</div>
                <div><span className="highlight">Email:</span> {info.email}</div>
                <div><span className="highlight">Phone:</span> {info.phone}</div>
                <div><span className="highlight">Age:</span> {info.age}</div>
                <div><span className="highlight">Gender:</span> {info.gender}</div>
                <div><span className="highlight">Address:</span> {info.address}</div>
                <div><span className="highlight">Province:</span> {info.province}</div>
                <div><span className="highlight">Education:</span>
                    {
                        info.education?.map(i => {
                            return <li>
                                <div>School name: {i.schoolName}, Field: {i.field}</div>
                            </li>
                        })
                    }
                </div>
                <div><span className="highlight">Experience:</span>
                    {
                        info.experience?.map(i => {
                            return <li>
                                Company name: {i.companyName}, Position: {i.position}, Seniority: {i.seniority}, Description: {i.description}
                            </li>
                        })
                    }
                </div>
                <div><span className="highlight">Skill:</span>
                    {
                        info.skill?.map(i => {
                            return <span>
                                {i.skillName + ', '} 
                            </span>
                        })
                    }
                </div>
                <div><span className="highlight">Certificate:</span> {
                    info.certificate?.map(i => {
                        return <li>
                            Cert name: {i.certName}, Description: {i.description}
                        </li>
                    })
                }</div>
                <div><span className="highlight">Product:</span> {
                    info.product?.map(i => {
                        return <li>
                            Link: <a target="_blank" href={i.link}>{i.link}</a>, Description: {i.description}
                        </li>
                    })
                }</div>
            </Modal>
        }
        <h1>Employee</h1>
        <div>
            {
                props.employees.map(i => {
                    return <div className="company-item" >
                        <div className="name" onClick={()=> handleModal(i)}>{i.name}</div>
                        <Button danger onClick={()=> handleDelete(i._id)}>Delete</Button>
                    </div>
                })
            }
        </div>
    </div>
}

Employee.Layout = MainLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    if(!allCookies.jwt) {
        return {redirect: {
            permanent: false,
            destination: "/",
        }}
    }

    const responseEmployee = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`, {
        method: 'GET'
    })
    const resultEmployee = await responseEmployee.json();
    
    return {
        props: {
            employees: resultEmployee.employeeList
        }
    }
}