import { Button, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";

export default function ChatBot({ socket, user, setShowChatBox }: any) {
	const [roomId, setRoomId] = useState<string>("");
	const [chat, setChat] = useState<string>("");
	const [listChat, setListChat] = useState<any>([]);
	const [incomingChat, setIncomingChat] = useState();

	// use effect untuk emit msg dan join room
	useEffect(() => {
		socket.on("getChat", (data: any) => setIncomingChat(data));
		socket.on("getRoom", (data: string) => setRoomId(data));
	}, []);

	// function joinRoom() {
	// 	socket.emit("joinRoom", roomId);
	// }

	function sendChat() {
		socket.emit("sendChat", {
			userId: user.id,
			username: user.fullname,
			chat: chat,
			roomId: roomId,
		});
		setChat("");
	}

	useEffect(() => {
		if (incomingChat !== undefined && incomingChat !== "") {
			setListChat([...listChat, incomingChat]);
		}
	}, [incomingChat]);

	console.log(listChat);

	return (
		<div className="border">
			<button onClick={() => setShowChatBox(false)}>close</button>
			<div>Chatbox</div>
			<div className="chat-box w-full">
				<ul>
					{listChat.map((el: any, i: number) => (
						<li key={i}>
							<div
								className={
									el.userId === user.id
										? `text-right`
										: `text-left`
								}
							>
								{el.username} <br /> {el.chat}
							</div>
						</li>
					))}
				</ul>
			</div>
			<Input
				variant="outlined"
				placeholder="input chat"
				value={chat || ""}
				onChange={({ target }) => setChat(target.value)}
			/>
			<button onClick={sendChat}>send</button>
			{/* <Input
				variant="outlined"
				placeholder="input room id"
				value={roomId || ""}
				onChange={({ target }) => setRoomId(target.value)}
			/>
			<button onClick={joinRoom}>join room</button> */}
		</div>
	);
}
