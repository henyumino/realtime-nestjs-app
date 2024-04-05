import {
	Navbar,
	Typography,
	IconButton,
	Button,
	Input,
} from "@material-tailwind/react";
import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function NavbarDark({ notif, setNotif }: any) {
	return (
		<Navbar
			variant="gradient"
			color="blue-gray"
			className="mx-auto max-w-screen-xl from-blue-gray-900 to-blue-gray-800 px-4 py-3"
		>
			<div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
				<Typography
					as="a"
					href="/"
					variant="h6"
					className="mr-4 ml-2 cursor-pointer py-1.5"
				>
					Material Tailwind
				</Typography>
				<div className="ml-auto flex gap-1 md:mr-4">
					<IconButton variant="text" color="white">
						<Cog6ToothIcon className="h-4 w-4" />
					</IconButton>
					<IconButton
						variant="text"
						color="white"
						className="relative"
						onClick={() => setNotif(false)}
					>
						{notif ? (
							<div className="w-2 h-2 bg-red-500 rounded-full absolute -right-1 -top-1"></div>
						) : null}

						<BellIcon className="h-4 w-4" />
					</IconButton>
				</div>
			</div>
		</Navbar>
	);
}
