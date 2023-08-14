import { useRouter } from 'next/router';
import {ImProfile,ImHeart} from 'react-icons/im';
import {BsFillBriefcaseFill,BsChatText} from 'react-icons/bs';
import {BiLogOut,BiMailSend} from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import {clearCookies} from '../../utils/cookieHandler.js';

export default function ProfileLayout({children}) {
    const router = useRouter();
    const dispatch = useDispatch();

    return <div id='profile-layout'>
        <div id='profile-menu'>
            <div 
                onClick={() => router.push('/profile')}
                style={router.pathname==='/profile'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <ImProfile/>My profile
            </div>
            <div
                onClick={() => router.push('/profile/job-applied')}
                style={router.pathname==='/profile/job-applied'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <BsFillBriefcaseFill/>Jobs Applied
            </div>
            <div
                onClick={() => router.push('/profile/job-invitation')}
                style={router.pathname==='/profile/job-invitation'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <BiMailSend/>Job Invitations
            </div>
            <div
                onClick={() => router.push('/profile/job-following')}
                style={router.pathname==='/profile/job-following'? {backgroundColor:'#e5f2fb'} : {}}
            >
                <ImHeart/>Jobs Following
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