import CompanyProfileLayout from "../../components/company-profile/CompanyProfileLayout.js"
import { Form, Input, Select, message, Button, Space, Upload, Image} from "antd";
import { COUNTRY, INDUSTRY, PROVINCES, COMPANY_SIZE } from "../../utils/enum.js";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import cookies from "next-cookies";
import { useSelector } from 'react-redux';
import { useState } from "react";
import ImgCrop from 'antd-img-crop';
import {AiOutlineUpload,AiOutlinePlus} from "react-icons/ai";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../utils/firebase.js";
import { v4 } from "uuid";
const {TextArea} = Input;

export default function CompanyProfile(props) {
    const {form} = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const accountId = useSelector((state) => state.auth.currentUser?.accountId);
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

    const [imageFileList, setImageFileList] = useState();
    const [imgUrl, setImgUrl] = useState(props.companyData.image?? 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');

    const onChangeImage = (e) => {
        setImageFileList(e.fileList);
    }

    const onFinish = async (values) => {
        setLoading(true);
        let imageUrl = props.companyData.image?? '';
        if(imageFileList?.length) {
            const imageUpload = imageFileList[0].originFileObj;
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            let snapshot = await uploadBytesResumable(imageRef, imageUpload);
            imageUrl = await getDownloadURL(snapshot.ref);
            setImgUrl(imageUrl);
        }

        const responseComp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/create-or-update-company`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...values, accountId: accountId, image: imageUrl})
        })
        if(responseComp.status == 200) {
            messageApi.success('You haved updated company profile successfully!')
        } else {
            messageApi.error('Update company profile failed')
        }
        setLoading(false);
    }

    return <div id="company-profile">
        {contextHolder}
        <h2 style={{marginTop:0}}>Company profile</h2>
        <Form
            {...formItemLayout}
            form={form}
            scrollToFirstError
            onFinish={onFinish}
            initialValues={props.companyData}
        >
            <Form.Item
                label='Image'
            >
                <Space direction="row">
                    <Image width={200} src={imgUrl} style={{borderRadius:'6px'}} />
                    <ImgCrop rotationSlider>
                        <Upload
                            name="image"
                            listType="picture-card"
                            maxCount={1}
                            defaultFileList={imageFileList}
                            onChange={onChangeImage}
                        >
                            <div><AiOutlinePlus/><div style={{marginTop: 8}}>Upload</div></div>
                        </Upload>
                    </ImgCrop>
                </Space>
            </Form.Item>
            <Form.Item name='name' label='Company Name' rules={[{required: true}]}>
                <Input />
            </Form.Item>
            <Form.Item name='email' label='Email' rules={[{required: true}, {type:'email'}]}>
                <Input />
            </Form.Item>
            <Form.Item name='description' label='Describe company' rules={[{required: true}]}>
                <TextArea
                    allowClear
                    placeholder="Write description"
                    autoSize={{minRows: 5, maxRows: 6}}
                />
            </Form.Item>
            <Form.Item name='website' label='Website'>
                <Input />
            </Form.Item>
            <Form.Item label='Address'>
                <Form.List
                    name='address'
                >
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map((field, index) => (
                            <Form.Item
                                key={field.key}
                            >
                                <Form.Item
                                    {...field}
                                    noStyle
                                >
                                    <Input
                                        placeholder="address"
                                        style={{
                                            width: '90%',
                                            marginRight: '10px'
                                        }}
                                    />
                                </Form.Item>
                                {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                    />
                                ) : null}
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add field
                            </Button>
                        </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item name='province' label='Province' rules={[{required: true}]}>
                <Select placeholder='Select province'>
                    {
                        Object.values(PROVINCES).map(p => {
                            return <Option value={p}>{p}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item name='country' label='Country' rules={[{required: true}]}>
                <Select placeholder='Select country'>
                    {
                        Object.values(COUNTRY).map(c => {
                            return <Option value={c}>{c}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item name='companySize' label='Company Size' rules={[{required: true}]}>
                <Select placeholder='Select company size'>
                    {
                        Object.values(COMPANY_SIZE).map(s => {
                            return <Option value={s}>{s}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item name='industry' label='Industry' rules={[{required: true}]}>
                <Select 
                    placeholder='Select industry' 
                
                    allowClear
                    mode="multiple"
                >
                    {
                        Object.values(INDUSTRY).map(i => {
                            return <Option value={i}>{i}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item name='tech' label='Tech Stack'>
                <Select 
                    placeholder='Select tech stack' 
                
                    allowClear
                    mode="multiple"
                >
                    {
                        props.skills.length && props.skills.map(s => {
                            return <Option value={s._id}>{s.skillName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType='submit' loading={loading}>Submit Company Info</Button>
            </Form.Item>
        </Form>
    </div>
}

CompanyProfile.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    let companyId = allCookies.companyId;

    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/get-by-id/${companyId}`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();

    return {
        props: {
            skills: resultSkill.skills,
            companyData: resultCompany.company
        }
    }
}