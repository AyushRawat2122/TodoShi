import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaEnvelope, FaBook, FaChevronLeft, FaArrowsAltH, FaUser } from 'react-icons/fa';
import { MdContacts } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import { useSelector } from 'react-redux';

const VerticalNav = () => {
	const [collapsed, setCollapsed] = useState(false);
	const isLarge = useIsLargeScreen();
	const user = useSelector((state) => state.user.data);

	const navItems = [
		{ path: '/', name: 'Home', icon: <FaHome />, color: 'from-blue-500 to-blue-600' },
		{ path: '/dashboard', name: 'Dashboard', icon: <MdContacts />, color: 'from-purple-500 to-purple-600' },
		{ path: '/about', name: 'About', icon: <FaInfoCircle />, color: 'from-green-500 to-green-600' },
		{ path: '/contact', name: 'Contact', icon: <FaEnvelope />, color: 'from-pink-500 to-pink-600' },
		{ path: '/guide', name: 'Guide', icon: <FaBook />, color: 'from-orange-500 to-orange-600' }
	];

	const toggleCollapse = () => setCollapsed(!collapsed);

	return (
		<>
			{/* Desktop vertical nav (>=768px) */}
			{isLarge && (
				<motion.div 
					className={`bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} rounded-3xl`}
					initial={{ x: -100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					{/* Header */}
					<div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center p-6 border-b border-gray-100/50`}>
						{!collapsed && (
							<motion.img 
								src="/todoshi-branding.png" 
								alt="Workgrid" 
								className='h-12 object-contain'
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
							/>
						)}
						<button
							className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#4c1f8e] hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
							onClick={toggleCollapse}
							title={collapsed ? "Expand" : "Collapse"}
						>
							<motion.div
								animate={{ rotate: collapsed ? 180 : 0 }}
								transition={{ duration: 0.3 }}
							>
								{collapsed ? <FaArrowsAltH size={18} /> : <FaChevronLeft size={18} />}
							</motion.div>
						</button>
					</div>

					{/* Navigation Links */}
					<nav className="py-8 flex-grow">
						<ul className="space-y-3 px-4">
							{navItems.map((item) => (
								<motion.li 
									key={item.path}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * navItems.indexOf(item) }}
								>
									<NavLink
										to={item.path}
										className={({ isActive }) =>
											`group flex items-center ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} rounded-2xl transition-all duration-300 relative overflow-hidden ${
												isActive 
													? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25` 
													: 'text-gray-600 hover:text-[#4c1f8e] hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
											}`
										}
										title={collapsed ? item.name : ''}
									>
										<motion.span 
											className={`text-xl ${collapsed ? '' : 'mr-4'} relative z-10`}
											whileHover={{ scale: 1.1 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											{item.icon}
										</motion.span>
										<AnimatePresence>
											{!collapsed && (
												<motion.span 
													className="font-semibold text-sm tracking-wide relative z-10"
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: "auto" }}
													exit={{ opacity: 0, width: 0 }}
													transition={{ duration: 0.2 }}
												>
													{item.name}
												</motion.span>
											)}
										</AnimatePresence>
									</NavLink>
								</motion.li>
							))}
						</ul>
					</nav>

					{/* User Profile Section (Optional) */}
					<motion.div 
						className="p-4 border-t border-gray-100/50"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<div className={`flex ${collapsed ? 'justify-center' : 'items-center'} p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 cursor-pointer group`}>
							<div className="relative">
								{user?.avatar?.url ? (
									<img 
										src={user.avatar.url} 
										alt="Profile" 
										className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-200" 
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
										<FaUser className="text-white text-sm" />
									</div>
								)}
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
							</div>
							<AnimatePresence>
								{!collapsed && (
									<motion.div 
										className="ml-3 flex-1 min-w-0"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.2 }}
									>
										<p className="text-sm font-semibold text-gray-800 truncate">
											{user?.username || 'Guest User'}
										</p>
										<p className="text-xs text-gray-500 truncate">
											{user?.role || 'Member'}
										</p>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			)}

			{/* Mobile bottom nav (<768px) */}
			{!isLarge && (
				<motion.div 
					className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 shadow-2xl"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<nav className="max-w-7xl mx-auto px-2">
						<ul
							className="grid grid-cols-5 gap-1 py-3"
							style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
						>
							{navItems.map((item, index) => (
								<motion.li 
									key={item.path} 
									className="flex"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * index }}
								>
									<NavLink
										to={item.path}
										className={({ isActive }) =>
											`flex-1 flex flex-col items-center justify-center gap-1 rounded-2xl py-3 px-2 text-xs transition-all duration-300 relative overflow-hidden ${
												isActive 
													? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
													: 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-[#4c1f8e]'
											}`
										}
										title={item.name}
									>
										<motion.span 
											className="text-lg"
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											transition={{ type: "spring", stiffness: 400, damping: 10 }}
										>
											{item.icon}
										</motion.span>
										<span className="font-medium tracking-wide">{item.name}</span>
									</NavLink>
								</motion.li>
							))}
						</ul>
					</nav>
				</motion.div>
			)}
		</>
	);
};

export default VerticalNav;
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Mobile bottom nav (<768px) */}
			{!isLarge && (
				<div className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
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
												isActive ? 'text-[#4c1f8e]' : 'text-gray-600 hover:bg-gray-100'
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
