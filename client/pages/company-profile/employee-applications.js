import cookies from "next-cookies";
import { Image, Tag, Button, message, Modal, Input, Divider } from 'antd';
import CompanyProfileLayout from '../../components/company-profile/CompanyProfileLayout.js'
import { useRouter } from 'next/router';
import {handleDisplaySalary, formatDate} from "../../utils/helper.js";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { useState } from "react";
import { extractFileName } from "../../utils/helper.js";
const {TextArea} = Input;

export default function EmployeeApplications(props) {
    const router = useRouter();
    const token = getCookiesClientSide('jwt');
    const [messageApi, contextHolder] = message.useMessage();
    const [applications, setApplications] = useState(props.applications)
    const [showAppModal, setShowAppModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    
    const handleAcceptApp = async (id, status, employeeId, companyId, jobId) => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/update/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: status })
        })
        if(response.status == 200) {
            messageApi.success('Update successfully');
            setApplications(prev => {
                const newState = prev.map(obj => {
                    if(obj._id === id) {
                        return {...obj, status: status};
                    }
                    return obj;
                })
                return newState;
            });
            
            if(status === 'accepted') {
                let responseChat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/get-by-company-employee`, {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json ',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ employeeId, companyId })
                });
                let resultChat = await responseChat.json();
                let acceptedJobsList = [];
                if(responseChat.status == 200) {
                    acceptedJobsList = resultChat.interview.acceptedJobsList;
                }
                acceptedJobsList.push(jobId);
                acceptedJobsList = acceptedJobsList.filter((item, index) => acceptedJobsList.indexOf(item) === index);

                let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/create-or-update`, {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json ',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ employeeId, companyId, acceptedJobsList })
                });
                if(response.status == 200) {
                    messageApi.success('Create interview successfully');
                } else {
                    messageApi.error('Create interview failed');
                }
            }
            router.push('/company-profile/employee-applications')
        } else {
            messageApi.error('Update failed');
        }
    }
    
    const handleOpenChatRoom = async (employeeId, companyId) => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/get-by-company-employee`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ employeeId, companyId })
        });
        if(response.status == 200) {
            let result = await response.json();
            router.push(`/interview/${result.interview._id}`);
        } else {
            messageApi.error('Cannot find interview room')
        }
    }

    return <div id="employee-applications">
        {
            <Modal
                title={`Your Application for ${modalInfo.title}`}
                open={showAppModal}
                onOk={()=> setShowAppModal(false)}
                onCancel={()=> setShowAppModal(false)}
                width={700}
            >
                <Divider style={{border:'1px solid #a3a3a2'}}/>
                <div id='application-modal'>
                    <div>
                        <span>Your CV</span>
                        {
                            modalInfo.cv? <a target="_blank" href={modalInfo.cv}>{extractFileName(modalInfo.cv)}</a> :
                            <span>No CV</span>
                        }
                    </div>
                    <div>
                        <span>
                            Your cover letter or portfolio link
                            <span style={{color:'red'}}> *</span>    
                        </span>
                        <TextArea
                            readOnly
                            value={modalInfo.coverLetter}
                        />
                    </div>
                </div>
            </Modal>
        }
        {contextHolder}
        <h2 style={{marginTop:0}}>Employee Applications</h2>
        {
            !applications.length && <div>No data</div>
        }
        {
            applications.length && applications.map(app => {
                return <div id="app-job-item">
                    <div>
                        <Image 
                            width={100}
                            height={100}
                            style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                            src={app.companyId.image}
                            fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                        />
                    </div>
                    <div>
                        <div>
                            <h3 onClick={()=>router.push(`/jobs/${app.jobId._id}`)}>{app.jobId.title}</h3>
                            {handleDisplaySalary(app.jobId)}
                        </div>
                        <div className="job-sub-info">{app.companyId.name}</div>
                        <div style={{fontSize: '1.2rem'}}>Employee: {app.employeeId.name}</div>
                        <div className="job-sub-info">Application time: {formatDate(app.timestamp)}</div>
                        <div>
                            <div>Status: <span className={`status-${app.status}`}>{app.status}</span></div>
                        </div>
                        <div className="button-div">
                            {
                                app.status === 'pending' && 
                                <div>
                                    <Button type='primary' style={{background:'green'}}
                                        onClick={() => handleAcceptApp(app._id, 'accepted', app.employeeId, app.companyId, app.jobId._id)}
                                    >
                                        Accept
                                    </Button>
                                    <span>&nbsp;&nbsp;&nbsp;</span>
                                    <Button type='primary' danger
                                        onClick={() => handleAcceptApp(app._id, 'declined')}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            }
                            <div>
                                <Button 
                                    type='primary'
                                    onClick={()=> {
                                        setShowAppModal(true);
                                        setModalInfo({
                                            cv: app.cv,
                                            coverLetter: app.coverLetter,
                                            title: app.jobId.title
                                        })
                                    }}
                                >
                                    View CV
                                </Button>
                                <span>&nbsp;&nbsp;&nbsp;</span>
                                {
                                    app.status === 'accepted' && 
                                    <Button onClick={()=> handleOpenChatRoom(app.employeeId, app.companyId)}>Message</Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            })
        }
    </div>
}

EmployeeApplications.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/get-by-company-id/${allCookies.companyId}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    });
    let applications = [];
    if(response.status == 200) {
        let result = await response.json();
        applications = result.applications;
    }

    return {
        props: {
            applications
        }
    }
}