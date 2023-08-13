import {Form, Input, Button, message} from 'antd'
import {AiOutlineUser} from 'react-icons/ai'
import {RiLockPasswordLine} from 'react-icons/ri'
import { useRouter } from 'next/router'
import { setLoginCookies } from '../utils/cookieHandler';

export default function Home() {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const onFinish = async (values) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                password: values.password
            })
        });
        const result = await response.json();
        if(response.status == 200) {
            messageApi.success(result.message)
            setLoginCookies(result.token)
            router.push('/dashboard')
        } else {
            messageApi.error(result.message)
        }
    }

    return (
        <div id="login">
            {contextHolder}
            <div className='logo'></div>
            <h1>Admin CMS</h1>
            <div>
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{
                            required: true,
                            message: 'Please input admin username!',
                        }]}
                    >
                        <Input placeholder="Admin username" prefix={<AiOutlineUser/>} size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Please input your password!',
                        }]}
                    >
                        <Input.Password placeholder="Password" prefix={<RiLockPasswordLine/>} size="large" />
                    </Form.Item>
                    <Button type="primary" size="large" htmlType='submit' block>Sign In</Button>
                </Form>
            </div>
        </div>
    );
}
