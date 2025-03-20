"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import CTASection from "@/components/sections/CTASection";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CaseStudies from "@/components/sections/CaseStudies";
import Footer from "@/components/layout/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [showScrollTop, setShowScrollTop] = useState(false);

	useEffect(() => {
		AOS.init({
			duration: 1000,
			easing: "ease-out-cubic",
			once: true,
			offset: 50,
			mirror: false
		});

		// Simulate content loading
		setTimeout(() => {
			setIsLoading(false);
		}, 500);

		// Handle scroll for scroll-to-top button
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 500);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<main className="bg-[#070c1b] relative min-h-screen">
			{/* Subtle animated background stars */}
			<div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden bg-[url('/stars-bg.png')] bg-repeat"></div>
			
			{isLoading ? (
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<div className="relative z-10">
					<Navbar />
					<Hero />
					<Features />
					<CaseStudies />
					<Testimonials />
					<Pricing />
					<FAQ />
					<CTASection />
					<Footer />
					
					{/* Scroll to top button */}
					{showScrollTop && (
						<button 
							onClick={scrollToTop}
							className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg z-50 hover:bg-blue-700 transition-all"
							aria-label="Scroll to top"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
							</svg>
						</button>
					)}
				</div>
			)}
		</main>
	);
}
