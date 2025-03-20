"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const supabase = createClientComponentClient();
	const router = useRouter();

	// Check authentication status
	useEffect(() => {
		const checkAuth = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setIsLoggedIn(!!session);
		};

		checkAuth();

		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			setIsLoggedIn(!!session);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	// Handle scroll for navbar appearance
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const authButton = {
		text: isLoggedIn ? 'Dashboard' : 'Login',
		href: isLoggedIn ? '/dashboard' : '/sign-in',
	};

	const navLinks = [
		{ text: 'Features', id: 'features' },
		{ text: 'Pricing', id: 'pricing' },
		{ text: 'FAQ', id: 'faq' }
	];

	const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setIsOpen(false); // Close mobile menu after clicking
		}
	};

	return (
		<nav 
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled 
					? 'bg-[#070c1b]/80 backdrop-blur-md py-3 shadow-lg' 
					: 'bg-transparent py-5'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
				{/* Logo */}
				<Link href="/">
					<div className="flex items-center">
						<div className="mr-2 h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
							<span className="text-white font-bold text-lg">B</span>
						</div>
						<span className="text-white font-bold text-xl">Brochure<span className="text-blue-500">AI</span></span>
					</div>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-8">
					<Link href="#features">
						<span className="text-gray-300 hover:text-white transition-colors">Features</span>
					</Link>
					<Link href="#pricing">
						<span className="text-gray-300 hover:text-white transition-colors">Pricing</span>
					</Link>
					<Link href="#faq">
						<span className="text-gray-300 hover:text-white transition-colors">FAQ</span>
					</Link>
					<Link href="/dashboard">
						<span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
							Dashboard
						</span>
					</Link>
				</div>

				{/* Mobile menu button */}
				<div className="md:hidden">
					<button 
						className="text-gray-300 hover:text-white"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden bg-[#0c1324] border-t border-[#1c2a47] py-4 px-4">
					<div className="flex flex-col space-y-4">
						{navLinks.map((item) => (
							<Link
								key={item.id}
								href={`#${item.id}`}
								onClick={(e) => handleScroll(e, item.id)}
								className="text-gray-300 hover:text-white transition-colors block py-2"
							>
								{item.text}
							</Link>
						))}
						<Link 
							href={authButton.href}
							className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg inline-block"
						>
							{authButton.text}
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
