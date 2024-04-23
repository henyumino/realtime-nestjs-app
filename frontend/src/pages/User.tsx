import { Button, list } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatBot from "../components/Chatbox";

const socket = io("http://localhost:5001");

export default function User() {
	const [user, setUser] = useState<any>();
	const navigate = useNavigate();
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [onlineUser, setOnlineUser] = useState<any>();
	const [showChatBox, setShowChatBox] = useState(false);

	const getOnlineUser = () => {
		socket.emit("getOnlineUser", (data: any) => console.log(data));
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await axios.get(
					"http://localhost:5000/users/profile"
				);
				if (res.status === 200) {
					setUser(res.data);
				}
			} catch (e: any) {
				console.log(e);
				if (e.response.status === 401) {
					localStorage.removeItem("access_token");
					navigate("/");
				}
			}
		};
		getUser();
		// socket.on("onlineUser", (data) => setOnlineUser(data));
		const getAllUser = async () => {
			try {
				const res = await axios.get("http://localhost:5000/users");
				if (res.status === 200) {
					setOnlineUser(res.data);
					// console.log(res.data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getAllUser();
	}, []);

	useEffect(() => {
		function onDisconnect() {
			socket.emit("removeOnlineUser", user?.id);
			setIsConnected(false);
		}
		if (socket.connected && user !== null) {
			setIsConnected(true);
			socket.emit("addOnlineUser", user);
		}
		window.addEventListener("beforeunload", onDisconnect);
		return () => {
			window.addEventListener("beforeunload", onDisconnect);
		};
	}, [user]);

	function joinRoom(userId: number, anotherUserId: string) {
		setShowChatBox(true);
		socket.emit("joinRoom", { userId, anotherUserId });
	}

	return (
		<>
			Welcome : {user?.fullname} userid: {user?.id}
			<br />
			connection status: {JSON.stringify(isConnected)}
			<br />
			<button onClick={getOnlineUser}>get online user</button>
			<Button
				onClick={() => {
					localStorage.removeItem("access_token");
					navigate("/");
				}}
			>
				log out
			</Button>
			{/* <Button onClick={addOnline}>add online</Button> */}
			<h1 className="text-2xl">Online User:</h1>
			<ul className="list-disc pl-6">
				{onlineUser &&
					onlineUser.map((el: any) => {
						if (el.id !== user.id) {
							return (
								<li key={el.id}>
									{el.fullname}{" "}
									<a
										onClick={() => joinRoom(user.id, el.id)}
										className="text-gray-500"
									>
										open chat
									</a>
								</li>
							);
						}
					})}
			</ul>
			{showChatBox && (
				<div className="w-1/4 ml-4">
					<ChatBot
						socket={socket}
						user={user}
						setShowChatBox={setShowChatBox}
					/>
				</div>
			)}
			{/* ketika klik start chat show chat bax dan join ke room */}
			{/* <button onClick={createRoom}>test</button> */}
		</>
	);
}
