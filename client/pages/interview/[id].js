import cookies from 'next-cookies';
import {useRouter} from 'next/router';
import io from "socket.io-client";
import {Input} from 'antd';
import { useSelector } from 'react-redux';
import {BsEmojiSmileFill} from 'react-icons/bs';
import {FaPaperPlane} from 'react-icons/fa';
import { useEffect, useState } from 'react';

const socket = io.connect(process.env.NEXT_PUBLIC_API_URL);

export default function Interview({data}) {
    const router = useRouter();
    const {id} = router.query;
    const currentUser = useSelector(state => state.auth.currentUser);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState(data.messages);
    
    const handleSendMessage = async () => {
        if(currentMessage) {
            const messageData = {
                interviewId: id,
                senderId: currentUser.accountType === 'company'? data.interview.companyId._id : data.interview.employeeId._id,
                message: currentMessage,
                timestamp: new Date()
            };
            await socket.emit('message', messageData);
            setMessageList(list => [...list, messageData]);
            setCurrentMessage('');
        }
    }
    
    useEffect(() => {
        socket.emit('join_room', {
            userId: currentUser.accountType === 'company'? data.interview.companyId._id : data.interview.employeeId._id,
            interviewId: id
        })
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, []);

    console.log(messageList)
    return <div id="interview">
        <div>

        </div>
        <div className='message-div'>
            <header>
                {
                    currentUser.accountType === 'company' && <span>{data.interview.employeeId.name}</span>
                }
                {
                    currentUser.accountType === 'employee' && <span>{data.interview.companyId.name}</span>
                }
            </header>
            <div className='message-body'>
                {
                    messageList.map(message => {
                        let messageClass = '';
                        if((currentUser.accountType === 'company' && message.senderId == data.interview.companyId._id) ||
                            (currentUser.accountType === 'employee' && message.senderId == data.interview.employeeId._id)) {
                            messageClass = 'me';
                        } else {
                            messageClass = 'you';
                        }
                        return <div className={messageClass}><span className={messageClass}>{message.message}</span></div>
                    })
                }
            </div>
            <footer>
                <BsEmojiSmileFill/>
                <Input.TextArea
                    size='large'
                    placeholder='Type message'
                    // autoSize={{maxRows: 4}}
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={e => {
                        e.key === "Enter" && handleSendMessage();
                    }}
                />
                <FaPaperPlane/>
            </footer>
        </div>
        <div className='info-div'>

        </div>
    </div>
}

export const getServerSideProps = async (ctx) => {
    const id = ctx.params.id;
    const allCookies = cookies({ req: ctx.req });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/get-interview-by-id/${id}`, {
        method: "GET",
        headers: { 
            'Content-Type':'application/json ',
            'Authorization': `Bearer ${allCookies.jwt}`
        }
    })
    let result = {}
    if(response.status == 200) {
        result = await response.json();
    }

    return {
        props: {
            data: result
        }
    }
}