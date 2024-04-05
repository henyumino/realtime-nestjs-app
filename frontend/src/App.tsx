import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Input } from "@material-tailwind/react";
import NavbarDark from "./components/Navbar";

const socket = io("http://localhost:5000");

export default function App() {
	const [msg, setMsg] = useState<any>([]);
	const [data, setData] = useState<any>("");
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [user, setUser] = useState<any>("");
	const [username, setUsername] = useState("");
	const [receiver, setReceiver] = useState("");

	// function sendMsg() {
	// 	socket.emit("send_chat", { id: `${Math.random()}`, msg: data });
	// 	setData("");
	// }

	function getOnlineUser() {
		socket.emit("getOnlineUser", (data) => console.log(data));
	}

  function sendNotif(){
    // send notif
    socket.emit('sendNotif', receiver)
  }

	useEffect(() => {
		if (user !== "") {
			console.log("triger");
			socket.emit("newOnlineUser", user);
		}
		return () => {
			// socket.off("newUserOnline");
		};
	}, [user]);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("getNotif", (data: any) => {
			console.log(data)
		});

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("getNotif"); 
		};
	}, []);

	// console.log(user);
	// NOTE : abaikan type component yang tidak satifies

	return (
		<>
			<NavbarDark />
			<p className="text-2xl text-red-500">asd</p>
			{isConnected ? "connected" : "not connect"}
			<div>
				{msg.map((el: any, i: number) => (
					<div key={i}>{el.msg}</div>
				))}
			</div>
			<div>
				<div className="w-1/4 m-auto">
					<Input
						variant="static"
						label="username"
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
					<button
						onClick={() => {
							if (username !== "") {
								setUser(username);
							}
						}}
						className="border border-gray-200 p-2"
					>
						add user
					</button>
				</div>
				<button onClick={getOnlineUser}>get online user</button>
			</div>
			<div className="m-auto w-1/4">
				<Input
          label="receiver id"
					variant="static"
					type="text"		
					value={receiver}
					onChange={({ target }) => setReceiver(target.value)}
				/>
        <button onClick={sendNotif}>send notif</button>
			</div>
		</>
	);
}

// function getDate() {
// 	// const time = new Date();
// 	return Date.now();
// }
