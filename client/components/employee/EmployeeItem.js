import { Button, Image, Tag } from "antd";
import { useRouter } from "next/router"
import { getRandomColor} from "../../utils/helper.js";
import {BsHeart,BsClockFill,BsFillPinMapFill,BsGenderAmbiguous} from "react-icons/bs";

export default function EmployeeItem({employeeData, isFollowingPage, handleUnfollow}) {
    const router = useRouter();

    return <div id="employee-item" >
        <div>
            <Image 
                width={110}
                height={110}
                style={{border:'1px solid #d4d4d4', borderRadius:'6px'}}
                src={employeeData.avatar}
                fallback="https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
            />
        </div>
        <div>
            <div className="name" onClick={()=> router.push(`/employee/${employeeData._id}`)}>{employeeData.name}</div>
            <div className="subinfo"><BsClockFill/>Age: {employeeData.age}</div>
            <div className="subinfo"><BsGenderAmbiguous/>{employeeData.gender}</div>
            <div className="subinfo"><BsFillPinMapFill/>{employeeData.province}</div>
            <div className="tech">{
                employeeData.skill.slice(0, 5).map(i => {
                    let color = getRandomColor();
                    return <Tag color={color}>{i.skillName}</Tag>
                })
            }</div>
            {
                isFollowingPage && 
                <Button style={{marginTop:'10px'}} danger size="large"
                    onClick={()=> handleUnfollow(employeeData._id)}
                >Unfollow</Button>
            }
        </div>
    </div>
}