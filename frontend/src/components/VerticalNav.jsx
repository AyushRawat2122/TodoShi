import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // updated
import { FaHome, FaInfoCircle, FaEnvelope, FaBook, FaChevronLeft, FaArrowsAltH } from 'react-icons/fa';
import { MdContacts } from "react-icons/md";
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import ThemeSwitch from './ThemeSwitch';
import useUser from '../hooks/useUser';
import { useEffect } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';

const VerticalNav = () => {
	const [collapsed, setCollapsed] = useState(false);
	const isLarge = useIsLargeScreen();
	const { user } = useUser(); 
	const [url , setUrl] = useState('');
	const [userName , setUserName] = useState('');
	const navigate = useNavigate(); // added
	const {isSignedIn} = useAuthStatus();
	const navItems = [
		{ path: '/', name: 'Home', icon: <FaHome /> },
		{ path: '/dashboard', name: 'Dashboard', icon: <MdContacts /> },
		{ path: '/about', name: 'About', icon: <FaInfoCircle /> },
		{ path: '/contact', name: 'Contact', icon: <FaEnvelope /> },
		{ path: '/guide', name: 'Guide', icon: <FaBook /> }
	];

	const toggleCollapse = () => setCollapsed(!collapsed);

	useEffect(() => {
		if(user?.data) {
			
		}
	}, [user]);

	return (
		<>
			{/* Desktop vertical nav (>=1025px) */}
			{isLarge && (
				<div className={`bg-white/90 dark:bg-[#0c0a1a] border border-[#6229b3]/10 dark:bg-gradient-to-br from-gray-50/10 from-10% to-white/1 dark:border-[#c2a7fb]/20 shadow-[0_8px_30px_rgba(98,41,179,0.08)] h-full flex flex-col ${collapsed ? 'w-15 rounded-full' : 'w-64 rounded-2xl'}`}>
					{/* Header */}
					<div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-[#6229b3]/10  dark:border-[#c2a7fb]/20`}>
						{!collapsed && (
							<img src="/todoshi-branding.png" alt="todoshi" className='h-10' />
						)}
						<button
							className="w-8 h-8 flex items-center justify-center text-[#4c1f8e]/80 dark:text-purple-200/80 hover:text-white hover:bg-[#6229b3] rounded-full transition-colors"
							onClick={toggleCollapse}
							title={collapsed ? 'Expand' : 'Collapse'}
						>
							{collapsed ? <FaArrowsAltH size={16} /> : <FaChevronLeft size={16} />}
						</button>
					</div>

					{/* Theme switch (desktop only) */}
					<div className={`px-3 pt-2 ${collapsed ? 'flex justify-center' : 'flex justify-end'}`}>
						<ThemeSwitch vertical={collapsed} />
					</div>

					{/* Navigation Links */}
					<nav className="py-6 flex-grow">
						<ul className="space-y-4">
							{navItems.map((item) => (
								<li key={item.path} className="px-3">
									<NavLink
										to={item.path}
										className={({ isActive }) =>
											`flex items-center ${collapsed ? 'justify-center' : ''} p-2 rounded-full transition-all ${
												isActive
													? 'bg-gradient-to-r from-[#6229b3] to-[#4c1f8e] text-white shadow-sm dark:bg-gradient-to-r dark:from-[#6229b3]/50 dark:to-[#4c1f8e]/40'
													: 'text-[#4c1f8e] dark:text-purple-200 hover:bg-[#6229b3]/20 dark:hover:bg-[#c2a7fb]/10'
											}`
										}
										title={collapsed ? item.name : ''}
									>
										<span className={`text-xl ${collapsed ? '' : 'ml-3 mr-3'}`}>{item.icon}</span>
										{!collapsed && <span className="font-medium">{item.name}</span>}
									</NavLink>
								</li>
							))}
						</ul>
					</nav>

					{/* User Profile Section (Optional) */}
					<div className="py-2 px-1">
						<div className={`flex ${collapsed ? 'justify-center' : 'items-center px-2'}`}>
							{/* Avatar or 'G' fallback */}
							<div className="w-10 h-10 rounded-full bg-[#c2a7fb] bg-opacity-30 overflow-hidden flex items-center justify-center">
								{(user?.data?.avatar?.url || user?.avatar?.url) ? (
									<img
										src={user?.data?.avatar?.url || user?.avatar?.url}
										alt="avatar"
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-sm font-medium text-[#4c1f8e] dark:text-purple-500">G</span>
								)}
							</div>

							{/* Details or Sign in button (only when expanded) */}
							{!collapsed && (
								isSignedIn ? (
									<div className="ml-3">
										<p className="text-sm font-medium text-[#4c1f8e] dark:text-purple-200 truncate">
											{user?.data?.username || 'Guest'}
										</p>
										<p className="text-xs text-purple-800/70 dark:text-purple-300 truncate">
											{user?.data?.email || user?.data?._id || user?._id || '—'}
										</p>
									</div>
								) : (
									<div className="ml-3">
										<button
											onClick={() => navigate('/sign-in')}
											className="px-5 py-2 rounded-full bg-[#6229b3] dark:bg-[#6229b3]/40 text-white text-sm hover:bg-[#4c1f8e] dark:hover:bg-[#4c1f8e]/40 transition"
										>
											Sign in
										</button>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			)}

			{/* Mobile bottom nav (<1025px) */}
			{!isLarge && (
				<div className="fixed bottom-0 inset-x-0 z-50 
					border-t border-[#6229b3]/15 dark:border-[#c2a7fb]/20
					bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75
					dark:bg-[#0c0a1a] dark:bg-gradient-to-t dark:from-gray-50/10 dark:from-10% dark:to-white/1"
				>
					<nav className="max-w-7xl mx-auto px-2">
						<ul
							className="grid grid-cols-5 gap-1 py-2"
							style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
						>
							{navItems.map((item) => (
								<li key={item.path} className="flex">
									<NavLink
										to={item.path}
										className={({ isActive }) =>
											`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition ${
												isActive
													? 'text-[#4c1f8e] dark:text-purple-200 bg-[#6229b3]/15 dark:bg-gradient-to-r dark:from-[#6229b3]/30 dark:to-[#4c1f8e]/20'
													: 'text-gray-600 dark:text-gray-300 hover:bg-[#6229b3]/10 dark:hover:bg-[#c2a7fb]/10'
											}`
										}
										title={item.name}
									>
										<span className="text-xl">{item.icon}</span>
										<span>{item.name}</span>
									</NavLink>
								</li>
							))}
						</ul>
					</nav>
				</div>
			)}
		</>
	);
};

export default VerticalNav;
