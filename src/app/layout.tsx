import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ExposeFlow",
	description:
		"Create stunning real estate brochures in minutes with our AI-powered platform",
};

export const dynamic = "force-dynamic";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en" suppressHydrationWarning className="overflow-x-hidden">
			<head>
				{/* Direct favicon links for better compatibility */}
				<link rel="icon" href="/favicon.png" />
				<link rel="shortcut icon" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/favicon.png" />
				<style>{`
					html, body {
						overflow-x: hidden !important;
						max-width: 100vw;
						width: 100%;
						margin: 0;
						padding: 0;
						border: none !important;
					}
				`}</style>
			</head>
			<body
				className={`${font.className} overflow-x-hidden w-full m-0 p-0 border-0`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					disableTransitionOnChange
				>
					<SupabaseProvider>
						<UserProvider>
							<div className="w-full overflow-x-hidden">{children}</div>
						</UserProvider>
					</SupabaseProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
