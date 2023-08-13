import {useRouter} from 'next/router';
import {Button, Divider, Image, Input, Modal, Radio, Space, Tag, Upload, message} from 'antd';
import {getExperience, getRandomColor, handleDisplaySalary} from "../../utils/helper.js";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import cookies from 'next-cookies';
import {FaUserGraduate,FaBriefcase,FaShoppingCart} from 'react-icons/fa'
import {GrCertificate} from 'react-icons/gr'
import {ImProfile} from 'react-icons/im'
const {TextArea} = Input;

export default function EmployeeDetail({employee, jobs}) {
    const router = useRouter();
    const id = router.query.id;
    const [messageApi, contextHolder] = message.useMessage();
    const [modalLoading, setModalLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [letter, setLetter] = useState('');
    const [jobChoice, setJobChoice] = useState(jobs[0]._id);
    const token = getCookiesClientSide('jwt');
    const companyId = getCookiesClientSide('companyId');

    const handleOk = async () => {
        setModalLoading(true);
        if(!letter) {
            messageApi.warning('Please write invitation letter')
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite/create`, {
                method: "POST",
                headers: {
                    'Content-Type':'application/json ',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    employeeId: employee._id,
                    jobId: jobChoice,
                    companyId: companyId,
                    invitation: letter,
                    status: 'pending'
                })
            })
            let result = await response.json()
            if(response.status == 200) {
                messageApi.success(result.message)
                setShowModal(false)
            } else {
                messageApi.error(result.message)
            }
        }
        setModalLoading(false);
    }

    const modalInvite = 
        <Modal
            title={`Job Invitation for ${employee.name}`}
            open={showModal}
            onOk={handleOk}
            confirmLoading={modalLoading}
            okText='Send Invitation'
            onCancel={() => setShowModal(false)}
            width={800}
        >
            <Divider style={{border:'1px solid #a3a3a2'}}/>
            <div id='invite-modal'>
                <div>
                    <header>Choose Job</header>
                    <div className='job-list'>
                        <Radio.Group value={jobChoice} onChange={(e)=> setJobChoice(e.target.value)}>
                            <Space direction='vertical'>
                                {
                                    jobs.map(i => {
                                        return <Radio value={i._id}>{i.title}</Radio>
                                    })
                                }
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                <div>
                    <header>Write invitation letter:</header>
                    <TextArea
                        allowClear
                        showCount
                        placeholder="Invitation letter"
                        rows={12}
                        onChange={(e) => setLetter(e.target.value)}
                        value={letter}
                    />
                </div>
            </div>
        </Modal>

    console.log(employee)
    return <div id='employee-detail'>
        {modalInvite}
        {contextHolder}
        <div className='employee-info'>
            <div className='first panel'>
                <div>
                    <Image 
                        width={130}
                        height={130}
                        style={{border:'1px solid #d4d4d4', borderRadius:'6px', objectFit: 'contain'}}
                        src={employee.avatar}
                        fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"        
                    />
                </div>
                <div>
                    <div className='employee-name'>{employee.name}</div>
                    <div className='employee-gender'>{employee.gender}</div>
                </div>
                <div className='personal-info'>
                    <header>Personal Info</header>
                    <div>
                        <span>Age: <span>{employee.age}</span></span>
                        <span>Phone: <span>{employee.phone}</span></span>
                    </div>
                    <div>
                        <span>Email: <span>{employee.email}</span></span>
                        <span>Province: <span>{employee.province}</span></span>
                    </div>
                    <div>
                        <span>Address: <span>{employee.address}</span></span>
                    </div>
                </div>
            </div>
            <div className='expertise-info'>
                <div>
                    <div className='panel'>
                        <header>Education</header>
                        {
                            employee.education.map((i, index) => {
                                return <>
                                    {
                                        index > 0 && <Divider/>
                                    }
                                    <div>
                                        <FaUserGraduate/>
                                        <div>
                                            <div>{i.schoolName}</div>
                                            <div>Field: {i.field}</div>
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                    <div className='panel'>
                        <header>Experience</header>
                        {
                            employee.experience.map((i, index) => {
                                return <>
                                    {
                                        index > 0 && <Divider/>
                                    }
                                    <div>
                                        <FaBriefcase/>
                                        <div>
                                            <div>Company: {i.companyName}</div>
                                            <div>Position: {i.position}</div>
                                            <div>Seniority: {i.seniority}</div>
                                            <div>Description: {i.description}</div>
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                    <div className='panel'>
                        <header>Certificate</header>
                        {
                            employee.certificate.map((i, index) => {
                                return <>
                                    {
                                        index > 0 && <Divider/>
                                    }
                                    <div>
                                        <GrCertificate/>
                                        <div>
                                            <div>{i.certName}</div>
                                            <div>Description: {i.description}</div>
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>
                <div>
                    <div className='panel'>
                        <header>Tech Skills</header>
                        {
                            employee.skill.map(i => {
                                let color = getRandomColor();
                                return <Tag color={color}>{i.skillName}</Tag>
                            })
                        }
                    </div>
                    <div className='panel'>
                        <header>Curriculum Vitae</header>
                        <div>
                            <ImProfile/>
                            <a target='_blank' href={employee.cv}>Link to CV</a>
                        </div>
                    </div>
                    <div className='panel'>
                        <header>Products</header>
                        {
                            employee.product.map((i, index) => {
                                return <>
                                    {
                                        index > 0 && <Divider/>
                                    }
                                    <div>
                                        <FaShoppingCart/>
                                        <div>
                                            <div><a target='_blank' href={i.link}>Link to product {index+1}</a></div>
                                            <div>Description: {i.description}</div>
                                        </div>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className='sub-info panel'>
            <Button type='primary' size='large' block
                onClick={()=> setShowModal(true)}
            >Invite to Interview</Button>
            <Button size='large' block>Follow</Button>
        </div>
    </div>
}

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const id = ctx.params.id;

    const responseEmp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/get-by-employee-id/${id}`, {
        method: 'GET'
    })
    const resultEmp = await responseEmp.json()

    const responseJob = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-by-company-id/${allCookies.companyId}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    });
    let resultJob = await responseJob.json();

    return {
        props: {
            employee: resultEmp.employee,
            jobs: resultJob.jobs
        }
    }
}