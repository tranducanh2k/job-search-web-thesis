import { Server } from "socket.io";
import { ChatMessage } from "../models/index.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"],
        },
    });
    const usersInRooms = {};

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);
        socket.removeAllListeners();

        socket.on('join_room', ({ userId, interviewId }) => {
            socket.join(interviewId);
            usersInRooms[socket.id] = { userId, interviewId };
            console.log(`${userId} joined room ${interviewId}`);
            console.log(usersInRooms)
        });

        socket.on('message', async ({ senderId, interviewId, message }) => {
            console.log(`User ${senderId} sent message in room ${interviewId}: ${message}`);
            const newMessage = await ChatMessage.create({
                interviewId: interviewId,
                senderId: senderId,
                message: message
            });
            if(newMessage) {
                socket.to(interviewId).emit('receive_message', { senderId, interviewId, message });
            } else {
                console.log(`error saving message ${message} of user ${senderId} in room ${interviewId}`)
            }
            console.log(usersInRooms)
        });

        socket.on('disconnect', () => {
            const { userId, interviewId } = usersInRooms[socket.id] || {};
            if (interviewId) {
                console.log(`${userId} left room ${interviewId}`);
                delete usersInRooms[socket.id];
            }
            console.log(usersInRooms)
        });
    });
}