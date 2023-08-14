import { useRouter } from 'next/router';
import {ImProfile,ImHeart} from 'react-icons/im';
import {BsFillBriefcaseFill,BsChatText} from 'react-icons/bs';
import {AiOutlineForm} from 'react-icons/ai'
import {BiLogOut, BiMailSend} from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import {clearCookies} from '../../utils/cookieHandler.js';

export default function CompanyProfileLayout({children}) {
    const router = useRouter();
    const dispatch = useDispatch();

    return <div id='profile-layout'>
        <div id='profile-menu'>
            <div 
                onClick={() => router.push('/company-profile')}
                style={router.pathname==='/company-profile'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <ImProfile/>Company Profile
            </div>
            <div
                onClick={() => router.push('/company-profile/create-jobs')}
                style={router.pathname.includes('/company-profile/create-jobs')? {backgroundColor:'#e5f2fb'} : {}}
            >
                <BsFillBriefcaseFill/>Create Jobs
            </div>
            <div 
                className='emp-application'
                onClick={() => router.push('/company-profile/employee-applications')}
                style={router.pathname==='/company-profile/employee-applications'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <AiOutlineForm/>Employee Applications
            </div>
            <div
                className='emp-application'
                onClick={() => router.push('/company-profile/job-invitation')}
                style={router.pathname==='/company-profile/job-invitation'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <BiMailSend/>Job Invitations
            </div>
            <div
                className='emp-application'
                onClick={() => router.push('/company-profile/candidates-following')}
                style={router.pathname==='/company-profile/candidates-following'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <ImHeart/>Candidates Following
            </div>
            <div 
                onClick={() => {
                    dispatch(logout());
                    router.push('/');
                    clearCookies();
                }}
            >
                <BiLogOut/>Log Out
            </div>
        </div>
        <div>
            {children}
        </div>
    </div>
}