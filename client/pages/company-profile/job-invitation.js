import CompanyProfileLayout from "../../components/company-profile/CompanyProfileLayout"
import cookies from "next-cookies";
import { Image, Tag, Button, message, Modal, Input, Divider } from 'antd';
import { useRouter } from 'next/router';
import { useState } from "react";
const {TextArea} = Input;
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { formatDate } from "../../utils/helper";

export default function JobInvitation({invitations}) {
    console.log(invitations)
    const router = useRouter();
    const [showModal, setShowModal] = useState(false)
    const [info, setInfo] = useState({});
    const token = getCookiesClientSide('jwt');

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
        }
    }

    return <div id="job-invitation">
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
        <h2 style={{marginTop:0}}>Job Invitation</h2>
        {
            invitations.map(i => {
                return <div id="app-job-item">
                    <div>
                        <Image 
                            width={100}
                            height={100}
                            style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                            src={i.employeeId.avatar}
                            fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                        />
                    </div>
                    <div>
                        <div>
                            <h3 onClick={()=>router.push(`/employee/${i.employeeId._id}`)}>Candidate: {i.employeeId.name}</h3>
                        </div>
                        <div className="job-sub-info"
                            style={{cursor:'pointer'}}
                            onClick={()=> router.push(`/jobs/${i.jobId._id}`)}
                        >Job invited: {i.jobId.title}</div>
                        <div className="job-sub-info">Timestamp: {formatDate(i.timestamp)}</div>
                        <div>
                            <div>Status: <span className={`status-${i.status}`}>{i.status}</span></div>
                        </div>
                        <div className="button-div">
                            <Button type="primary" 
                                onClick={() => {
                                    setShowModal(true)
                                    setInfo({
                                        employeeName: i.employeeId.name,
                                        invitation: i.invitation
                                    })
                                }}
                            >View Invitation</Button>
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

JobInvitation.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
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
}