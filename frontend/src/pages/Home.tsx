import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";

type Auth = {
	email: string;
	password: string;
};

export default function Home() {
	const [data, setData] = useState<Auth>({
		email: "",
		password: "",
	});

	const [user, setUser] = useState(false);
  const navigate = useNavigate()

	const login = async () => {
		try {
			const res = await axios.post(
				"http://localhost:5000/auth/login",
				data
			);
			if (res.status === 201) {
				const token = res.data.access_token;
				localStorage.setItem("access_token", token);
        navigate('/user')
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		if (token !== null) {
			setUser(true);
		}
	}, []);

	return (
		<div className="h-screen flex justify-center">
			<div className="m-auto w-1/4">
				<h1 className="text-2xl text-center py-2">Login</h1>
				<div className="flex flex-col gap-y-4">
					<Input
						label="email"
						name="email"
						value={data.email || ""}
						onChange={({ target }) =>
							setData({ ...data, email: target.value })
						}
					/>
					<Input
						label="password"
						type="password"
						value={data.password || ""}
						onChange={({ target }) =>
							setData({ ...data, password: target.value })
						}
					/>
					<Button onClick={login}>Login</Button>
					{user && <Navigate to="/user" replace={true} />}
				</div>
			</div>
		</div>
	);
}
