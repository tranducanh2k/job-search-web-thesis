import Image from 'next/image';
import {AiFillPhone} from "react-icons/ai";
import {BiSolidBookAlt} from "react-icons/bi";
import {GiHamburgerMenu, GiGraduateCap} from "react-icons/gi";
import {IoMdArrowDropdown} from "react-icons/io";

export default function Navbar() {
    return <div id="navbar">
        <div>
            <Image 
                src="/images/vecteezy_job-search-logo_8688110.jpg" 
                width="120px"
                height="110px"
                alt='logo'
            />
            <ul>
                <li><AiFillPhone/> 038.211.4388</li>
                <li><BiSolidBookAlt/> Contact us</li>
                <li>
                    <Image 
                        src="/images/Wikipedia-Flags-VN-Vietnam-Flag.512.png" 
                        width="30px"
                        height="30px"
                        alt='flag'
                    />
                </li>
            </ul>
        </div>
        <div>
            <div>
                <GiHamburgerMenu/>
                <a>IT Jobs</a>
                <a>IT Companies</a>
                <a>Jobs Following</a>
                <a>IT Fresher Jobs <GiGraduateCap/></a>
                <a>Recommended Jobs</a>
            </div>
            <div>
                username
                <IoMdArrowDropdown/>
            </div>
        </div>
    </div>
}