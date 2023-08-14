import {AiFillInstagram, AiFillFacebook,AiOutlineTwitter,AiFillLinkedin} from 'react-icons/ai'

export default function Footer() {
    return <div id='footer'>
        <div className='socialMedia'>
            <AiFillInstagram />
            <AiFillFacebook />
            <AiOutlineTwitter />
            <AiFillLinkedin />
        </div>
        <p> &copy; 2021 tutor.com</p>
    </div>
}