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
		socket.on("onlineUser", (data) => setOnlineUser(data));
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

  function createRoom(userId: number, userSocket: string){
    const data = {
      userSocket, userId
    }
    // console.log(data)
    socket.emit('createRoom', (data: any) => console.log(data))
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
            if(el.id !== user.id){
              return <li key={el.id}>{el.fullname} <a onClick={() => createRoom(el.id, el.socket_id)}>start chat</a></li>
            }
          })}
			</ul>
      <div className="w-1/4 ml-4">
        <ChatBot socket={socket} user={user} />
      </div>
      {/* <button onClick={createRoom}>test</button> */}
		</>
	);
}

