import {useRouter} from 'next/router';
import {Button, Divider, Image, Input, Modal, Radio, Space, Tag, Upload, message} from 'antd';
import {getExperience, getRandomColor, handleDisplaySalary} from "../../utils/helper.js";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { useSelector } from 'react-redux';
import cookies from 'next-cookies';
import JobItem from '../../components/jobs/JobItem.js';
const {TextArea} = Input;

export default function CompanyDetail({company, jobs}) {
    const router = useRouter();

    return <div id='job-detail' className='company-detail'>
        <div>
            <div className='job-info'>
                <div className='first'>
                    <div>
                        <Image 
                            width={200}
                            height={100}
                            style={{border:'1px solid #d4d4d4', borderRadius:'6px', objectFit: 'contain'}}
                            src={company.image}
                            fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"        
                        />
                    </div>
                    <div>
                        <div className='job-name'>{company.name}</div>
                        <div className='job-company'>{company.province}</div>
                        <br/>
                        <div className='job-company'>{company.country}</div>
                    </div>
                </div>
                <Divider/>
                <div className='second'>
                    <div>
                        <div className='description'>
                            <header>Company Size</header>
                            <p>{company.companySize}</p>
                            <header>Description</header>
                            <p>{company.description}</p>
                        </div>
                    </div>
                    <div className='float-div'>
                        <div>
                            <div className='info-title'>Industry</div>
                            <Space size={[0, 5]} wrap>
                                {
                                    company.industry.map(i => {
                                        return <Tag color={getRandomColor()}>{i}</Tag>
                                    })
                                }
                            </Space>
                        </div>
                        <div>
                            <div className='info-title'>Tech Stack</div>
                            <Space size={[0, 5]} wrap>
                                {
                                    company.tech.map(skill => {
                                        return <Tag color={getRandomColor()}>{skill.skillName}</Tag>
                                    })
                                }
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
            <div className='job-list'>
                <h2>Job List</h2>
                {
                    jobs.map(i => {
                        return <JobItem jobData={i} />
                    })
                }
            </div>
        </div>
        <div className='company-info'>
            <div className='title'>Contact Information</div>
            <div className='info-title'>Email</div>
            <p>{company.email}</p>
            <Divider/>
            <div className='info-title'>Website</div>
            <p>{company.website}</p>
            <Divider/>
            <div className='info-title'>Address</div>
            {
                company.address.map(i => {
                    return <li>{i}</li>
                })
            }
            <Divider/>
        </div>
    </div>
}

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const id = ctx.params.id;
    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/get-by-id/${id}?populateTech=true`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-by-company-id/${id}?populate=true`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    });
    let jobs = [];
    if(response.status == 200) {
        let result = await response.json();
        jobs = result.jobs;
    }
    
    return {
        props: {
            company: resultCompany.company,
            jobs: jobs
        }
    }
}