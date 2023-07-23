import { Form, Input, Select, message } from "antd";
import { COUNTRY, INDUSTRY, PROVINCES } from "../utils/enum";
import { COMPANY_SIZE } from "../../server/utils/enum";
const {TextArea} = Input;

export default function SignUp(props) {
    const {form} = Form.useForm();
    const {Option} = Select;
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        const responseReg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
                accountType: 'company'
            })
        });
        const resultReg = await responseReg.json();
        if(responseReg.status == 200) {
            const responseComp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/create-or-update-company`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...values, accountId: resultReg.accountId})
            })
            if(responseComp.status == 200) {
                messageApi.success('You haved created company account successfully!')
            } else {
                messageApi.error('Create company account failed')
            }
        } else if (responseReg.status == 404) {
            messageApi.error(resultReg.message)
        }
    }

    return <div id="sign-up">
        {contextHolder}
        <div>
            <h1>Start finding talents</h1>
            <h2>Submit your company information</h2>
            <Form
                form={form}
                scrollToFirstError
                onFinish={onFinish}
            >
                <Form.Item name='username' label='Username' rules={[{required: true}]} >
                    <Input size="large" />
                </Form.Item>
                <Form.Item name='password' label='Password'>
                    <Input.Password size="large" />
                </Form.Item>
                <Form.Item 
                    name='confirmPassword' 
                    label='Confirm Password'
                    rules={[
                        {
                            required: true,
                            message: "Please re-enter your password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        })
                    ]}
                    dependencies={['password']}
                    hasFeedback
                >
                    <Input.Password size="large" />
                </Form.Item>
                <Form.Item name='name' label='Company Name' rules={[{required: true}]}>
                    <Input size="large" />
                </Form.Item>
                <Form.Item name='email' label='Email' rules={[{required: true}, {type:'email'}]}>
                    <Input size="large" />
                </Form.Item>
                <Form.Item name='description' label='Describe your company' rules={[{required: true}]}>
                    <TextArea
                        allowClear
                        placeholder="Write description"
                        autoSize={{minRows: 5, maxRows: 6}}
                    />
                </Form.Item>
                <Form.Item name='website' label='Website'>
                    <Input size="large" />
                </Form.Item>
                <Form.Item name='address' label='Address'>
                    
                </Form.Item>
                <Form.Item name='province' label='Province' rules={[{required: true}]}>
                    <Select placeholder='Select province' size="large">
                        {
                            Object.values(PROVINCES).map(p => {
                                return <Option value={p}>{p}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='country' label='Country' rules={[{required: true}]}>
                    <Select placeholder='Select country' size="large">
                        {
                            Object.values(COUNTRY).map(c => {
                                return <Option value={c}>{c}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='companySize' label='Company Size' rules={[{required: true}]}>
                    <Select placeholder='Select company size' size="large">
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
                        size="large"
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
                        size="large"
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
                <Form.Item>
                    <button className="submit-form" htmlType='submit'>Submit Company Info</button>
                </Form.Item>
            </Form>
        </div>
        <img
            src="images/signup.jpg"
            width={'45%'}
        />
    </div>
}

export const getServerSideProps = async (ctx) => {
    const responseSkill = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill`, {
        method: 'GET'
    })
    const resultSkill = await responseSkill.json();

    return {
        props: {
            skills: resultSkill.skills
        }
    }
}