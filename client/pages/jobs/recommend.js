import { Button, message, Pagination } from 'antd';
import {getCookiesClientSide} from '../../utils/cookieHandler.js'
import { useState, useEffect } from 'react';
import JobItem from '../../components/jobs/JobItem.js';
import { useSelector } from 'react-redux';

export default function Recommend() {
    const [messageApi, contextHolder] = message.useMessage();
    const employeeId = useSelector((state) => state.auth.currentUser?.employeeId);
    const [jobsList, setJobsList] = useState([]);
    const pageSize = 8;
    const [curPage, setCurPage] = useState(1);
    const [curJobs, setCurJobs] = useState([]);

    const handleJumpPage = (pageNumber) => {
        setCurPage(pageNumber);
    }
    useEffect(() => {
        setCurJobs(jobsList.slice((curPage-1) * pageSize, curPage * pageSize));
    }, [curPage, jobsList]);

    const calculate = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/calculate-recommend`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json '
            }
        })
        let result = await response.json();
        if(response.status == 200) {
            messageApi.success(result.message)
        } else {
            messageApi.error(result.message)
        }
    }

    const getRecommend = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-recommend/${employeeId}`, {
            method: "GET",
            headers: {
                'Content-Type':'application/json '
            }
        })
        let res = await response.json();
        if(response.status == 200) {
            setJobsList(res.result)
            messageApi.success(res.message)
        } else {
            messageApi.error(res.message)
        }
    }

    return <div className="recommend" id='jobs'>
        {contextHolder}
        <div className='main-search'>
        </div>
        <div>
            <div className='search-result'>
                <div className='advanced-search'>
                    <h2>Recommended Jobs</h2>
                    <Button type='primary' size='large' onClick={()=> calculate()} >Calculate Recommendation</Button>
                    <Button size='large' onClick={()=> getRecommend()}>Get Recommendation</Button>
                </div>
                <div className='jobs-result'>
                {
                    !jobsList.length ? <h2>0 search result</h2> :
                        curJobs.map(job => <JobItem jobData={job} />)
                    }
                    <br/>
                    <Pagination 
                        showQuickJumper
                        total={jobsList.length}
                        pageSize={pageSize}
                        current={curPage}
                        onChange={handleJumpPage}
                    />
                    <br/><br/>
                </div>
            </div>
        </div>
    </div>
}