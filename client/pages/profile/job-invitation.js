import cookies from "next-cookies";
import ProfileLayout from "../../components/profile/ProfileLayout.js"
import {wrapper} from "../../redux/store.js";
import { Image, Tag, Button, Modal, Divider, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { getCookiesClientSide } from "../../utils/cookieHandler";
import {handleDisplaySalary, formatDate} from "../../utils/helper.js";
import { useState } from "react";
import { extractFileName } from "../../utils/helper.js";
const {TextArea} = Input;

export default function JobInvitation(props) {
    const router = useRouter();
    const token = getCookiesClientSide('jwt');
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [info, setInfo] = useState({});
    const [messageApi, contextHolder] = message.useMessage();
    const [invitations, setInvitations] = useState(props.invitations?? []);

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

    const handleAcceptInv = async (id, status, employeeId, companyId, jobId) => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite/update`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ employeeId, jobId, status })
        })
        if(response.status == 200) {
            messageApi.success('Update successfully');
            setInvitations(prev => {
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
            router.push('/profile/job-invitation')
        } else {
            messageApi.error('Update failed');
        }
    }

    return <div id="job-applied">
        {
            <Modal
                title={`Invitation for ${info.employeeName}`}
                open={showModal}
                onOk={()=> setShowModal(false)}
                onCancel={()=> setShowModal(false)}
                width={700}
            >
                <Divider style={{border:'1px solid #a3a3a2'}}/>
                <div id='application-modal'>
                    <div>
                        <span>
                            Invitation Letter
                        </span>
                        <TextArea
                            readOnly
                            value={info.invitation}
                            rows={7}
                        />
                    </div>
                </div>
            </Modal>
        }
        {contextHolder}
        <h2 style={{marginTop:0}}>Job Invitations</h2>
        {
            !invitations.length && <div>No data</div>
        }
        {
            invitations.length && invitations.map(i => {
                return <div id="app-job-item">
                    <div>
                        <Image 
                            width={100}
                            height={100}
                            style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                            src={i.companyId.image}
                            fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                        />
                    </div>
                    <div>
                        <div>
                            <h3 onClick={()=>router.push(`/jobs/${i.jobId._id}`)}>{i.jobId.title}</h3>
                            {handleDisplaySalary(i.jobId)}
                        </div>
                        <div className="job-sub-info">{i.companyId.name}</div>
                        <div className="job-sub-info">Invitation time: {formatDate(i.timestamp)}</div>
                        <div>
                            <div>Status: <span className={`status-${i.status}`}>{i.status}</span></div>
                        </div>
                        <div className="button-div">
                            {
                                i.status === 'pending' && 
                                <div>
                                    <Button type='primary' style={{background:'green'}}
                                        onClick={() => handleAcceptInv(i._id, 'accepted', i.employeeId._id, i.companyId._id, i.jobId._id)}
                                    >
                                        Accept
                                    </Button>
                                    <span>&nbsp;&nbsp;&nbsp;</span>
                                    <Button type='primary' danger
                                        onClick={() => handleAcceptInv(i._id, 'declined')}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            }
                            <Button 
                                type='primary' 
                                onClick={()=> {
                                    setShowModal(true);
                                    setInfo({
                                        employeeName: i.employeeId.name,
                                        invitation: i.invitation
                                    })
                                }}
                            > 
                                View Invitation
                            </Button>
                            {
                                i.status === 'accepted' && 
                                <Button onClick={() => handleOpenChatRoom(i.employeeId._id, i.companyId._id)}>Message</Button>
                            }
                        </div>
                    </div>
                </div>
            })
        }
    </div>
}

JobInvitation.Layout = ProfileLayout;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite/get-by-company-id/${allCookies.companyId}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();

    return {
        props: {
            invitations: result.invites
        }
    }
})