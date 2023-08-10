import CompanyProfileLayout from "../../../components/company-profile/CompanyProfileLayout.js";
import { Button, Space, Form, Input, Select, message, InputNumber, Checkbox } from "antd";
import cookies from "next-cookies";
import { useRouter } from "next/router.js";
import {BsArrowLeft} from "react-icons/bs";
import { JOB_LEVEL, JOB_TYPE } from "../../../utils/enum.js";
import { getCookiesClientSide } from "../../../utils/cookieHandler.js";

export default function EditJobs({ skills, jobData, companyData }) {
    const [form] = Form.useForm();
    const router = useRouter();
    const id = router.query.id;
    const [messageApi, contextHolder] = message.useMessage();
    const token = getCookiesClientSide('jwt');
    const companyId = getCookiesClientSide('companyId');
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 6,
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
                offset: 18,
            },
        },
    };

    const onFinish = async (values) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/create-or-update/${id}`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...values,
                companyId: companyId,
                searchMetafield: [values.title, companyData.name, companyData.province,
                    values.requiredSkill.map(id => {
                        let matchingItem = skills.find(item => item._id === id);
                        return matchingItem ? matchingItem.skillName : null;
                    })
                ].flat().join(' ')
            })
        })
        const result = await response.json();
        if(response.status == 200) {
            messageApi.success(result.message);
        } else {
            messageApi.error(result.message);
        }
    }

    return (
        <div id="edit-jobs">
            {contextHolder}
            <Space align="baseline" size='large'>
                <Button onClick={()=> router.push('/company-profile/create-jobs')}><BsArrowLeft/></Button>
                <h2 style={{ marginTop: 0 }}>{id === 'add'? "Add Job" : "Edit Job"}</h2>
            </Space>
            <Form
                {...formItemLayout}
                form={form}
                scrollToFirstError
                onFinish={onFinish}
                initialValues={{
                    ...jobData,
                    requiredSkill: jobData.requiredSkill?.map(skill => skill._id) // Map _id values
                }}
            >
                <Form.Item name='title' label='Title' rules={[{required: true}]} >
                    <Input />
                </Form.Item>
                <Form.Item name='requiredExperience' help="months" label='Required Experience' rules={[{required: true}, {type: 'number'}]} >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name='jobLevel' label='Job Level' rules={[{required: true}]}>
                    <Select placeholder='Select job level' >
                        {
                            Object.values(JOB_LEVEL).map(i => {
                                return <Option value={i}>{i}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='minSalary' label='Min Salary' >
                    <InputNumber prefix='$' min={0} />
                </Form.Item>
                <Form.Item name='maxSalary' label='Max Salary' >
                    <InputNumber prefix='$' min={0} />
                </Form.Item>
                <Form.Item name='jobType' label='Job Type' rules={[{required: true}]}>
                    <Select placeholder='Select job type' >
                        {
                            Object.values(JOB_TYPE).map(i => {
                                return <Option value={i}>{i}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="Is Fulltime" name="fullTime" valuePropName="checked">
                    <Checkbox value={true}>Yes</Checkbox>
                </Form.Item>
                <Form.Item name='requiredSkill' label='Required Skill Tags'>
                    <Select 
                        placeholder='Select skills' 
                        allowClear
                        mode="multiple"
                    >
                        {
                            skills.length && skills.map(s => {
                                return <Option value={s._id}>{s.skillName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name='description'
                    label='Description'
                >
                    <Form.Item
                        name={['description', 'role']}
                        label='Role'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe role and responsibility" />
                    </Form.Item>
                    <Form.Item
                        name={['description', 'skillRequired']}
                        label='Skill Required'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe skill required" />
                    </Form.Item>
                    <Form.Item
                        name={['description', 'benefit']}
                        label='Benefit'
                    >
                        <Input.TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder="Describe employee's benefit" />
                    </Form.Item>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType='submit'>Submit Form</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

EditJobs.Layout = CompanyProfileLayout;

export const getServerSideProps = async (ctx) => {
    let allCookies = cookies({req: ctx.req});
    let companyId = allCookies.companyId;

    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    let jobData = {};
    if(ctx.params.id !== 'add') {
        const responseJob = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/get-by-id/${ctx.params.id}`, {
            method: 'GET'
        })
        const resultJob = await responseJob.json();
        jobData = resultJob.job;
    }

    const responseCompany = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/get-by-id/${companyId}`, {
        method: 'GET'
    })
    const resultCompany = await responseCompany.json();

    return {
        props: {
            skills: resultSkill.skills,
            jobData: jobData,
            companyData: resultCompany.company
        }
    }
}