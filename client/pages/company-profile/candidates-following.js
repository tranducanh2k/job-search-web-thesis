import CompanyProfileLayout from '../../components/company-profile/CompanyProfileLayout.js'
import { useRouter } from "next/router.js";
import cookies from "next-cookies";
import { useSelector } from 'react-redux';
import {message} from 'antd';
import { useState } from "react";
import { getCookiesClientSide } from "../../utils/cookieHandler";
import EmployeeItem from '../../components/employee/EmployeeItem.js';

export default function CandidatesFollowing({candidates}) {
    const router = useRouter();
    const token = getCookiesClientSide('jwt');
    const [messageApi, contextHolder] = message.useMessage();
    const accountId = useSelector((state) => state.auth.currentUser?.accountId);

    const handleUnfollow = async (id) => {
        let candidatesFollowing = candidates?? [];
        let index = candidatesFollowing.findIndex(obj => obj._id === id);
        candidatesFollowing.splice(index, 1);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/create-or-update-company`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                accountId: accountId,
                candidatesFollowing: candidatesFollowing
            })
        })
        if(response.status == 200) {
            messageApi.success('Unfollow successfully');
        } else {
            messageApi.error('Unfollow failed');
        }
        router.push('/company-profile/candidates-following');
    }

    return <div id='candidates-following'>
        {contextHolder}
        <h2 style={{marginTop:0}}>Candidates Following</h2>
        <div>
            {
                candidates.map(i => {
                    return <EmployeeItem employeeData={i} isFollowingPage={true} handleUnfollow={handleUnfollow} />
                })
            }
        </div>
        
    </div>
}

CandidatesFollowing.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});

    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/get-by-id/${allCookies.companyId}`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();

    return {
        props: {
            candidates: resultCompany.company.candidatesFollowing
        }
    }
}