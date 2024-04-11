import { Button, list } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
        if(e.response.status === 401){
          localStorage.removeItem('access_token')
          navigate('/')
        }
			}
		};
		getUser();
    socket.on("onlineUser", (data) => setOnlineUser(data));
	}, []);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
      socket.emit("removeOnlineUser", user?.id);
			setIsConnected(false);
		}

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    window.addEventListener("beforeunload", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			window.addEventListener("beforeunload", onDisconnect);
		};
	}, [user]);

  useEffect(() => {
    if(user){
      socket.emit("addOnlineUser", user);
    }
  }, [user])


  // TODO lanjut buat private chat feature
	return (
		<>
			Welcome : {user?.fullname} userid: {user?.id}
			<br />
			connection status: {JSON.stringify(isConnected)}
			<br />
			<Button
				onClick={() => {
					localStorage.removeItem("access_token");
					navigate("/");
				}}
			>
				log out
			</Button>
			<Button onClick={getOnlineUser}>get online</Button>
      <h1 className="text-2xl">Online User:</h1>
			<ul className="list-disc pl-6">
				{onlineUser && onlineUser.map((el: any) => (
					<li key={el.id}>{el.fullname}</li>
				))}
			</ul>
		</>
	);
}
