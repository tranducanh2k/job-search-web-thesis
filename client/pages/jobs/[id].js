import {useRouter} from 'next/router';
import {Button, Divider, Image, Input, Modal, Radio, Space, Tag, Upload, message} from 'antd';
import {getExperience, getRandomColor, handleDisplaySalary} from "../../utils/helper.js";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { useState } from 'react';
import {AiOutlineUpload} from 'react-icons/ai'
import { useSelector } from 'react-redux';
import cookies from 'next-cookies';
import { storage } from "../../utils/firebase.js";
import { v4 } from "uuid";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
const {TextArea} = Input;

export default function JobDetail({job, employee}) {
    const router = useRouter();
    const id = router.query.id;
    const accountType = useSelector((state) => state.auth.currentUser?.accountType);
    const employeeId = useSelector((state) => state.auth.currentUser?.employeeId);
    const accountId = useSelector((state) => state.auth.currentUser?.accountId);
    const [messageApi, contextHolder] = message.useMessage();
    const [showModal, setShowModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [checkCoverLetter, setCheckCoverLetter] = useState('');
    const token = getCookiesClientSide('jwt');
    const [showUnfollowBtn, setShowUnfollowBtn] = useState(employee?.jobsFollowing && (employee.jobsFollowing.findIndex(job => job._id === id) != -1));
    const [cvChoice, setCvChoice] = useState(0);
    const [cvFile, setCvFile] = useState();

    const handleFollowJob = async () => {
        let jobsFollowing = employee.jobsFollowing?? [];
        if(!showUnfollowBtn) {
            jobsFollowing.push(id);
            setShowUnfollowBtn(true);
        } else {
            let index = jobsFollowing.indexOf(id);
            jobsFollowing.splice(index, 1);
            setShowUnfollowBtn(false);
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/create-or-update-employee`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                accountId: accountId,
                jobsFollowing: jobsFollowing
            })
        })
        if(response.status == 200) {
            messageApi.success('Update jobs following successfully');
        } else {
            messageApi.error('Update jobs following failed');
        }
    }
    const onChangeCv = (e) => {
        setCvFile(e.fileList[0]);
    }

    const handleOk = async () => {
        setModalLoading(true);
        if(!coverLetter) {
            setCheckCoverLetter('error');
            messageApi.warning('Please write cover letter');
            setModalLoading(false);
            return;
        } else {
            setCheckCoverLetter('');
        }
        if(employeeId) {
            let currentCvUrl = '';
            if(cvChoice == 0) {
                currentCvUrl = employee.cv;
            } else {
                if(cvFile) {
                    const cvUpload = cvFile.originFileObj;
                    const cvRef = ref(storage, `cv/${cvUpload.name + '?' + v4()}`);
                    let snapshot = await uploadBytesResumable(cvRef, cvUpload);
                    let cvUrl = await getDownloadURL(snapshot.ref);
                    currentCvUrl = cvUrl;
                    setCvFile(prev => {
                        return {
                            ...prev, url: cvUrl
                        }
                    });
                }
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/create`, {
                method: "POST",
                headers: {
                    'Content-Type':'application/json ',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    employeeId: employeeId,
                    jobId: job._id,
                    companyId: job.companyId._id,
                    cv: currentCvUrl,
                    coverLetter: coverLetter
                })
            })
            const result = await response.json();
            if(response.status == 200) {
                messageApi.success(result.message);
                setModalLoading(false);
                setShowModal(false);
            } else {
                messageApi.error(result.message);
                setModalLoading(false);
            }
        } else {
            messageApi.warning('Please update your employee info in profile');
            setShowModal(false);
        }
    }
    
    const modalApplyJob = 
        <Modal
            title={`You are applying for ${job.title} at ${job.companyId.name}`}
            open={showModal}
            onOk={handleOk}
            confirmLoading={modalLoading}
            okText='Send Application'
            onCancel={() => setShowModal(false)}
            width={800}
        >
            <Divider style={{border:'1px solid #a3a3a2'}}/>
            <div id='application-modal'>
                <div>
                    <span>Your CV</span>
                    <Radio.Group onChange={(e)=> setCvChoice(e.target.value)} value={cvChoice}>
                        <Space direction='vertical'>
                            <Radio value={0}>Use your CV in profile</Radio>
                            <Radio value={1}>Upload new CV</Radio>
                            {
                                cvChoice == 1 && <Upload
                                    accept="application/pdf"
                                    onChange={onChangeCv}
                                    fileList={cvFile? [cvFile] : []}
                                    maxCount={1}
                                >
                                    <Button icon={<AiOutlineUpload/>}>Click to Upload</Button>
                                </Upload>
                            }
                        </Space>
                    </Radio.Group>
                </div>
                <div>
                    <span>
                        Your cover letter or portfolio link
                        <span style={{color:'red'}}> *</span>    
                    </span>
                    <TextArea
                        allowClear
                        showCount
                        status={checkCoverLetter}
                        placeholder="Write your cover letter"
                        autoSize={{minRows: 3, maxRows: 14}}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        value={coverLetter}
                    />
                </div>
            </div>
        </Modal>;

    return <div id='job-detail'>
        {modalApplyJob}
        {contextHolder}
        <div className='job-info'>
            <div>
                <div className='first'>
                    <div>
                        <Image 
                            width={200}
                            height={100}
                            style={{border:'1px solid #d4d4d4', borderRadius:'6px', objectFit: 'contain'}}
                            src={job.companyId.image}
                            fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"        
                        />
                    </div>
                    <div>
                        <div className='job-name'>{job.title}</div>
                        <div className='job-company'>{job.companyId.name}</div>
                    </div>
                </div>
                <Divider/>
                <div className='second'>
                    <div>
                        <div>
                            <div className='salary'>Salary: {handleDisplaySalary(job)}</div>
                        </div>
                        <div className='description'>
                            <header>Your role & responsibilities:</header>
                            <p>{job.description.role}</p>
                            <header>Your skills & qualifications:</header>
                            <p>{job.description.skillRequired}</p>
                            <header>Your benefit</header>
                            <p>{job.description.benefit}</p>
                        </div>
                    </div>
                    <div className='float-div'>
                        {
                            accountType !== 'company' &&
                            <>
                                <Button type='primary' onClick={() => setShowModal(true)}>Apply Now</Button><br/>
                                <span>or</span><br/>
                                {
                                    showUnfollowBtn? 
                                    <Button danger onClick={() => handleFollowJob()}>Unfollow Job</Button> :
                                    <Button onClick={() => handleFollowJob()}>Follow Job</Button>
                                }
                            </>
                        }
                        <div>
                            <div className='info-title'>Location</div>
                            <ul>
                                {
                                    job.companyId.address.map(a => {
                                        return <li key={a}>{a}</li>
                                    })
                                }
                            </ul>
                        </div>
                        <div>
                            <div className='info-title'>Minimum year of experience</div>
                            <Tag color='red'>{getExperience(job.requiredExperience)}</Tag>
                        </div>
                        <div>
                            <div className='info-title'>Job level</div>
                            <Tag color='magenta'>{job.jobLevel}</Tag>
                        </div>
                        <div>
                            <div className='info-title'>Job type</div>
                            <Tag color='purple'>{job.jobType}</Tag>
                        </div>
                        <div>
                            <div className='info-title'>Contract type</div>
                            <Tag color='cyan'>{job.fullTime? 'Full time' : 'Part time'}</Tag>
                        </div>
                        <div>
                            <div className='info-title'>Skills required</div>
                            <Space size={[0, 5]} wrap>
                                {
                                    job.requiredSkill.map(skill => {
                                        return <Tag color={getRandomColor()}>{skill.skillName}</Tag>
                                    })
                                }
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='company-info'>
            <div className='info-title'>Company</div>
            <p>{job.companyId.name}</p>
            <Divider/>
            <div className='info-title'>Website</div>
            <p>{job.companyId.website}</p>
            <Divider/>
            <div className='info-title'>Headquarter</div>
            <p>{job.companyId.province}</p>
            <Divider/>
            <div className='info-title'>Addresses</div>
            <ul>
                {
                    job.companyId.address.map(a => {
                        return <li>{a}</li>
                    })
                }
            </ul>
            <Divider/>
            <div className='info-title'>Company Size</div>
            <p>{job.companyId.companySize}</p>
            <Divider/>
            <div className='info-title'>Industry</div>
            <p>{job.companyId.industry.map(i => <Tag color={getRandomColor()}>{i}</Tag>)}</p>
            <Divider/>
            <div className='info-title'>Tech Stack</div>
            <p>{job.companyId.tech.map(tech => <Tag color={getRandomColor()}>{tech.skillName}</Tag>)}</p>
            <Divider/>
            <div className='info-title'>Country</div>
            <p>{job.companyId.country}</p>
        </div>
    </div>
}

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-by-id/${ctx.params.id}`, {
        method: 'GET'
    })
    const result = await response.json()

    const responseEmp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/get-by-id?id=${allCookies.accountId}`, {
        method: 'GET'
    })
    const resultEmp = await responseEmp.json()
    
    return {
        props: {
            job: result.job,
            employee: resultEmp.employee
        }
    }
}