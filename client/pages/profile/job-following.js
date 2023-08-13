import JobItem from "../../components/jobs/JobItem.js";
import ProfileLayout from "../../components/profile/ProfileLayout.js";
import cookies from "next-cookies";
import { useSelector } from 'react-redux';
import {message} from 'antd';
import { useState } from "react";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import { useRouter } from "next/router.js";

export default function JobFollowing({employee}) {
    const router = useRouter();
    const token = getCookiesClientSide('jwt');
    const [messageApi, contextHolder] = message.useMessage();
    const accountId = useSelector((state) => state.auth.currentUser?.accountId);
    const [jobsFollowing, setJobsFollowing] = useState(employee.jobsFollowing?? []);

    const handleUnfollow = async (jobId) => {
        let jobsFollowing = employee.jobsFollowing?? [];
        let index = jobsFollowing.findIndex(obj => obj._id === jobId);
        jobsFollowing.splice(index, 1);
        router.push('/profile/job-following');
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
            messageApi.success('Unfollow successfully');
        } else {
            messageApi.error('Unfollow failed');
        }
    }
    return <div id="job-following">
        {contextHolder}
        <h2 style={{marginTop:0}}>Jobs Following</h2>
        {
            jobsFollowing? 
            jobsFollowing.map(job => <JobItem jobData={job} isJobFollowingPage={true} handleUnfollow={handleUnfollow} />) :
            <div>0 job following</div>
        }
    </div>
}

JobFollowing.Layout = ProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    const responseEmp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/get-by-id?id=${allCookies.accountId}`, {
        method: 'GET'
    })
    const resultEmp = await responseEmp.json();

    return {
        props: {
            employee: resultEmp.employee
        }
    }
}