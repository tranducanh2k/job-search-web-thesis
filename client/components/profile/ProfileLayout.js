import { useRouter } from 'next/router';
import {ImProfile,ImHeart} from 'react-icons/im';
import {BsFillBriefcaseFill,BsChatText} from 'react-icons/bs';
import {BiLogOut} from 'react-icons/bi';
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
            <div>
                <BsFillBriefcaseFill/>Jobs Applied
            </div>
            <div >
                <ImHeart/>Jobs Following
            </div>
            <div>
                <BsChatText/>Chat Rooms
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