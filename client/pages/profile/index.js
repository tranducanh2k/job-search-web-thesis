import { Button, Form, Input, InputNumber, Select, Upload, message,Alert, Image, Space } from "antd";
import ProfileLayout from "../../components/profile/ProfileLayout";
import { PROVINCES } from "../../utils/enum";
import {AiOutlineUpload,AiOutlinePlus} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {wrapper} from "../../redux/store.js";
import cookies from 'next-cookies';
import { clearCookiesServerSide, getCookiesClientSide } from "../../utils/cookieHandler";
import ImgCrop from 'antd-img-crop';
import { useState } from "react";
import { checkCreatedEmployee, logout } from "../../redux/authSlice";
import { storage } from "../../utils/firebase.js";
import { v4 } from "uuid";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyProfile({employeeData}) {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const {Option} = Select;
    const [form] = Form.useForm();
    const token = getCookiesClientSide('jwt');
    const [loading, setLoading] = useState(false);
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 5,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            sm: {
                span: 24,
                offset: 5,
            },
        },
    };
    const [avatarFileList, setAvatarFileList] = useState();
    const [avaUrl, setAvaUrl] = useState(employeeData.avatar?? 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');
    const [cvFileList, setCvFileList] = useState();
    const [cvUrlList, setCvUrlList] = useState(employeeData.cv?? [])
    
    const onChangeAvatar = ({ fileList: newFileList }) => {
        setAvatarFileList(newFileList);
    }
    const onChangeCv = (e) => {
        setCvFileList(e.fileList);
        console.log(e)
    }

    const onFinishForm = async (values) => {
        setLoading(true);
        let avatarUrl = employeeData.avatar;
        if(avatarFileList?.length) {
            const imageUpload = avatarFileList[0].originFileObj;
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            let snapshot = await uploadBytesResumable(imageRef, imageUpload);
            avatarUrl = await getDownloadURL(snapshot.ref);
            setAvaUrl(avatarUrl);
        }
        let cvUrlTempList = employeeData.cv;
        if(cvFileList?.length) {
            for(let cv of cvFileList) {
                const cvUpload = cv.originFileObj;
                const cvRef = ref(storage, `cv/${cvUpload.name}`);
                let snapshot = await uploadBytesResumable(cvRef, cvUpload);
                let cvUrl = await getDownloadURL(snapshot.ref);
                cvUrlTempList.push(cvUrl);
                setCvUrlList(prev => [...prev, cvUrl]);
            }
        }

        const response = await fetch(`${API_URL}/employee/create-or-update-employee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({...values, 
                accountId: authState.currentUser.accountId, 
                avatar: avatarUrl,
                cv: cvUrlTempList
            })
        })
        const result = await response.json();
        if(response.status == 200) {
            messageApi.success(result.message);
            dispatch(checkCreatedEmployee(result.employee._id));
        } else {
            messageApi.error(result.message);
        }
        setLoading(false);
    }

    return <div id="profile">
        {contextHolder}
        {(!authState.currentUser?.employeeId) &&  <Alert style={{marginBottom:'20px'}} type="warning" showIcon message="You have not created employee profile. Please update to apply job" />}
        <h2 style={{marginTop:0, marginLeft:'12%'}}>Employee profile</h2>
        <Form
            {...formItemLayout}
            initialValues={employeeData}
            form={form}
            onFinish={onFinishForm}
            scrollToFirstError
        >
            <Form.Item
                label='Avatar'
            >
                <Space direction="row">
                    <Image width={200} src={avaUrl} style={{borderRadius:'6px'}} />
                    <ImgCrop rotationSlider>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            maxCount={1}
                            defaultFileList={avatarFileList}
                            onChange={onChangeAvatar}
                        >
                            <div><AiOutlinePlus/><div style={{marginTop: 8}}>Upload</div></div>
                        </Upload>
                    </ImgCrop>
                </Space>
            </Form.Item>
            <Form.Item
                name='name'
                label='Name'
                rules={[
                    {
                        required: true
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='phone'
                label='Phone'
                rules={[{required: true}]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='email'
                label='E-mail'
                rules={[{required: true}, {type: 'email'}]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='age'
                label='Age'
                rules={[{required: true}, {type: 'number'}]}
            >
                <InputNumber min={18} />
            </Form.Item>
            <Form.Item
                name='gender'
                label='Gender'
            >
                <Select placeholder="select your gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name='address'
                label='Address'
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='province'
                label='Province'
            >
                <Select placeholder='select province'>
                    {
                        Object.values(PROVINCES).map(p => {
                            return <Option value={p}>{p}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name='education'
                label='Education'
            >

            </Form.Item>
            <Form.Item
                name='experience'
                label='Experience'
            >

            </Form.Item>
            <Form.Item
                name='skill'
                label='Skill'
            >
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="Select your tech skills"
                    options={[{value:'js', label: 'js'}]}
                />
            </Form.Item>
            <Form.Item
                name='certificate'
                label='Certificate'
            >

            </Form.Item>
            <Form.Item
                name='product'
                label='Product'
            >
                
            </Form.Item>
            <Form.Item
                label='Your CV'
            >
                <Upload 
                    accept="application/pdf"
                    onChange={onChangeCv}
                    fileList={cvUrlList.map((cv, index) => {
                        return {
                            uid: cv,
                            url: cv,
                            name: `CV ${index}`,
                            status: 'done'
                        }
                    })}
                    maxCount={5}
                >
                    <Button icon={<AiOutlineUpload/>}>Click to Upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                </Button>
            </Form.Item>
        </Form>
    </div>
};

MyProfile.Layout = ProfileLayout;

export const getServerSideProps = wrapper.getServerSideProps(store => async ({req, res}) => {
    let employeeData = null;
    let allCookies = cookies({ req });

    const authResponse = await fetch(`${API_URL}/isAuth`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    })
    if(authResponse.status != 200) {
        clearCookiesServerSide(req.cookies, res);
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } 

    const response = await fetch(`${API_URL}/employee/get-by-id?id=${allCookies.accountId}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    });
    if(response.status == 200) {
        const result = await response.json();
        employeeData = result.employee;
    }

    return {
        props: {
            employeeData
        }
    }
})