import cookies from 'next-cookies';
import {useRouter} from 'next/router';
import io from "socket.io-client";
import {Input, Avatar, Space, Button, Tooltip, DatePicker, message, Tag} from 'antd';
import { useSelector } from 'react-redux';
import {BsEmojiSmileFill} from 'react-icons/bs';
import {FaPaperPlane} from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';
import {BsArrowLeft} from "react-icons/bs";
import { formatDate } from '../../utils/helper';
import {getCookiesClientSide} from '../../utils/cookieHandler.js';
import { getRandomColor } from '../../utils/helper.js';
const {TextArea} = Input;

const socket = io.connect(process.env.NEXT_PUBLIC_API_URL);

export default function Interview({data}) {
    const router = useRouter();
    const {id} = router.query;
    const currentUser = useSelector(state => state.auth.currentUser);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState(data.messages);
    const [interviewDate, setInterviewDate] = useState(data.interview.interviewDate?? '');
    const [note, setNote] = useState(data.interview.note?? '');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const token = getCookiesClientSide('jwt');
    const handleSendMessage = async () => {
        if(currentMessage.trim()) {
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
        const scrollContainer = document.querySelector('.message-body');
        scrollContainer.scrollTop = scrollContainer.scrollHeight;

        socket.emit('join_room', {
            userId: currentUser.accountType === 'company'? data.interview.companyId._id : data.interview.employeeId._id,
            interviewId: id
        })
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        const scrollContainer = document.querySelector('.message-body');
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, [currentMessage])

    const getMessageBody = () => {
        let messageArr = [];
        for(let i = 0; i < messageList.length; i++) {
            let message = messageList[i];
            let messageClass = '';
            if((currentUser?.accountType === 'company' && message.senderId == data.interview.companyId._id) ||
                (currentUser?.accountType === 'employee' && message.senderId == data.interview.employeeId._id)) {
                messageClass = 'me';
            } else {
                messageClass = 'you';
            }
            if(message.senderId != messageList[i+1]?.senderId) {
                messageClass += ' has-avatar'
            }
            if(message.senderId != messageList[i+1]?.senderId && message.senderId == messageList[i-1]?.senderId) {
                messageClass += ' last-message'
            } else if (message.senderId == messageList[i+1]?.senderId && message.senderId == messageList[i-1]?.senderId) {
                messageClass += ' middle-message'
            } else if (message.senderId == messageList[i+1]?.senderId && message.senderId != messageList[i-1]?.senderId) {
                messageClass += ' first-message'
            }
            messageArr.push(<div className={messageClass}>
                {
                    messageClass.includes('you') &&
                    <Avatar src={currentUser?.accountType === 'company'? data.interview.employeeId.avatar :  data.interview.companyId.image} />
                }
                <Tooltip title={formatDate(message.timestamp)}>
                    <span className={messageClass}>{message.message}</span>
                </Tooltip>
            </div>)
        }
        return messageArr;
    }

    const handleSave = async () => {
        setLoading(true)
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/create-or-update`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json ',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                employeeId: data.interview.employeeId, 
                companyId: data.interview.companyId,
                interviewDate: interviewDate,
                note: note  
            })
        });
        if(response.status == 200) {
            messageApi.success('Update interview date and note successfully');
        } else {
            messageApi.error('Update interview date and note failed');
        }
        setLoading(false)
    }

    return <div id="interview">
        {contextHolder}
        <div>
            <Button size='large' onClick={()=> router.push('/')}><BsArrowLeft/> &nbsp;&nbsp; Back to Profile</Button>
            <span style={{fontWeight:500}}>Interview Date:</span>
            {
                currentUser?.accountType === 'company' && 
                <DatePicker showTime onChange={(value, dateString)=> setInterviewDate(dateString)} />
            }
            <Input value={interviewDate} readOnly />
            <span style={{fontWeight:500}}>Interview Note:</span>
            <TextArea 
                placeholder='Write note for the interview' 
                value={data.interview.note} 
                onChange={e => setNote(e.target.value)} 
                rows={7}
                readOnly={currentUser?.accountType === 'company'? false : true}
            />
            {
                currentUser?.accountType === 'company' && <Button type='primary' loading={loading} onClick={()=>handleSave()}>Save</Button>
            }
        </div>
        <div className='message-div'>
            <header>
                {
                    currentUser?.accountType === 'company' && 
                    <>
                        <Avatar src={data.interview.employeeId.avatar} style={{border:'1px solid #f1f2f7', width: '60px', height: '60px'}} />
                        <span>{data.interview.employeeId.name}</span>
                    </>
                }
                {
                    currentUser?.accountType === 'employee' && 
                    <>
                        <Avatar src={data.interview.companyId.image} style={{border:'1px solid #f1f2f7', width: '60px', height: '60px'}} />
                        <span>{data.interview.companyId.name}</span>
                    </>
                }
            </header>
            <div className='message-body'>
                {
                    getMessageBody()
                }
            </div>
            <footer>
                <BsEmojiSmileFill/>
                <Input.TextArea
                    size='large'
                    placeholder='Type message'
                    autoSize={{maxRows: 2}}
                    rows={1}
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={e => {
                        e.key === "Enter" && handleSendMessage();
                    }}
                />
                <FaPaperPlane onClick={() => handleSendMessage()}/>
            </footer>
        </div>
        <div className='info-div'>
            <h2>Interview Job List</h2>
            {
                data.interview.acceptedJobsList.map(job => {
                    return <div>
                        <a target='_blank' href={`/jobs/${job._id}`} >{job.title}</a>
                        <div>
                            {
                                job.requiredSkill.map(skill => {
                                    let color = getRandomColor();
                                    return <Tag color={color}>{skill.skillName}</Tag>
                                })
                            }
                        </div>
                    </div>
                })
            }
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