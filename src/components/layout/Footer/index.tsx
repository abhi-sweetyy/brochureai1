import Link from "next/link";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	
	const productLinks = ['Features', 'Pricing', 'How it Works'];
	const companyLinks = ['About', 'Contact', 'FAQ'];
	const legalLinks = ['Privacy Policy', 'Terms of Service'];
	
	// Social media icons
	const socialLinks = [
		{
			name: 'Twitter',
			icon: (
				<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
				</svg>
			),
			href: '#'
		},
		{
			name: 'LinkedIn',
			icon: (
				<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
				</svg>
			),
			href: '#'
		},
		{
			name: 'GitHub',
			icon: (
				<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
				</svg>
			),
			href: '#'
		},
	];

	return (
		<footer className="relative border-t border-[#1c2a47] bg-[#070c1b] pt-16 pb-12">
			{/* Subtle background accent */}
			<div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none">
				<div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
				<div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
			</div>
			
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					{/* Logo and description */}
					<div className="col-span-2">
						<Link href="/" className="inline-block">
							<div className="flex items-center">
								<div className="mr-2 h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
									<span className="text-white font-bold text-lg">B</span>
								</div>
								<span className="text-white font-bold text-xl">Brochure<span className="text-blue-500">AI</span></span>
							</div>
						</Link>
						<p className="mt-4 text-gray-400 text-sm">
							AI-powered brochure generation platform for real estate professionals. Create stunning property brochures in minutes with artificial intelligence.
						</p>
						
						{/* Social icons with premium styling */}
						<div className="flex space-x-4 mt-6">
							{socialLinks.map((link) => (
								<a 
									key={link.name}
									href={link.href}
									className="h-8 w-8 rounded-full bg-[#1c2a47] hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center"
									aria-label={link.name}
								>
									<div className="text-gray-300 hover:text-white transition-colors">
										{link.icon}
									</div>
								</a>
							))}
						</div>
					</div>
					
					{/* Product links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Product</h3>
						<ul className="space-y-3">
							{productLinks.map((item) => (
								<li key={item}>
									<a 
										href={`/#${item.toLowerCase().replace(/\s+/g, '-')}`} 
										className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center"
									>
										<div className="h-1 w-1 bg-blue-500 mr-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"></div>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
					
					{/* Company links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Company</h3>
						<ul className="space-y-3">
							{companyLinks.map((item) => (
								<li key={item}>
									<a 
										href={`/#${item.toLowerCase()}`} 
										className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
									>
										{item}
									</a>
								</li>
							))}
						</ul>
					</div>
					
					{/* Legal links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Legal</h3>
						<ul className="space-y-3">
							{legalLinks.map((item) => (
								<li key={item}>
									<a 
										href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
										className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
									>
										{item}
									</a>
								</li>
							))}
						</ul>
						
						{/* Newsletter signup - new addition */}
						<div className="mt-8">
							<h3 className="text-white font-semibold mb-4">Updates</h3>
							<div className="flex">
								<input 
									type="email" 
									placeholder="Your email" 
									className="bg-[#111b33] text-white px-3 py-2 rounded-l-lg border-y border-l border-[#1c2a47] focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full" 
								/>
								<button 
									type="submit"
									className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 rounded-r-lg hover:opacity-90 transition-opacity"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
				
				<div className="mt-12 pt-8 border-t border-[#1c2a47] flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-500 text-sm">
						© {currentYear} BrochureAI. All rights reserved.
					</p>
					
					<div className="mt-4 md:mt-0 flex space-x-6">
						<a href="#" className="text-gray-500 hover:text-blue-400 text-xs transition-colors">
							Made with <span className="text-red-500">❤️</span> from India
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
