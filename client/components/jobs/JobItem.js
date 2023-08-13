import { Image, Tag, Button } from 'antd';
import { useRouter } from 'next/router';
import {BsHeart,BsClockFill,BsFillPinMapFill} from "react-icons/bs";
import {handleDisplaySalary, getRandomColor} from "../../utils/helper.js";
import { useSelector } from 'react-redux';

export default function JobItem({jobData, isJobFollowingPage, handleUnfollow}) {
    const router = useRouter();
    const accountType = useSelector((state) => state.auth.currentUser?.accountType);

    return <a id='job-item' >
        <div>
            <Image 
                width={133}
                height={133}
                style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                src={jobData.companyId.image}
                fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
            />
        </div>
        <div>
            <div onClick={() => router.push(`/jobs/${jobData._id}`)}>
                <h3>{jobData.title}</h3>
                {handleDisplaySalary(jobData)}
            </div>
            <div className='job-sub-info'>{jobData.companyId.name}</div>
            <div className='job-sub-info'>
                <div>
                    <span style={{marginRight:'20px'}}><BsFillPinMapFill/>&nbsp;{jobData.companyId.province}</span>
                    <span><BsClockFill/>&nbsp;{jobData.fullTime? 'Full time':'Part time'}</span>
                </div>
            </div>
            <div>
                <div>
                    {
                        jobData.requiredSkill.slice(0,4).map(skill => {
                            let color = getRandomColor();
                            return <Tag color={color}>{skill.skillName}</Tag>
                        })
                    }
                </div>
                {
                    !isJobFollowingPage?
                    <div>
                        {
                            accountType == 'employee' && <>
                                <Button type='primary' onClick={()=> router.push(`/jobs/${jobData._id}`)}>Apply Job</Button>
                                <span>&nbsp;&nbsp;&nbsp;</span>
                                <Button className='heart-icon' icon={<BsHeart />} type='text'></Button>
                            </>
                        }
                    </div> :
                    <div>
                        <Button danger onClick={()=> handleUnfollow(jobData._id)}>Unfollow Job</Button>
                    </div>
                }
            </div>
        </div>
    </a>
}