"use client";

import ProgressBar from "next-nprogress-bar";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ProgressBar
				height="5px"
				color="#DB6885"
				options={{ showSpinner: false }}
				shallowRouting
				appDirectory
			/>
		</>
	);
};

export default Providers;
