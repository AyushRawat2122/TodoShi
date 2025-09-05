import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FaComments, FaHistory, FaInfoCircle, FaUsers, FaClipboardList, FaChevronLeft } from 'react-icons/fa';
import useIsLargeScreen from '../hooks/useIsLargeScreen';
import useUser from '../hooks/useUser';


const WorkspaceNav = ({ projectId, projectName }) => {
	// return nothing if no project id is provided via props
	if (!projectId) return null;

	const isLarge = useIsLargeScreen();
	const navigate = useNavigate();
	const { user } = useUser();

	const subroutes = [
		// Info removed from array as it will be handled separately
		{ path: `/workspace/${projectName}/${projectId}/chat`, name: 'Chat', icon: <FaComments /> },
		{ path: `/workspace/${projectName}/${projectId}/logs`, name: 'Logs', icon: <FaHistory /> },
		{ path: `/workspace/${projectName}/${projectId}/collaborators`, name: 'Collaborators', icon: <FaUsers /> },
		{ path: `/workspace/${projectName}/${projectId}/todos`, name: 'Todos', icon: <FaClipboardList /> }
	];

	const handleBackClick = () => {
		navigate('/dashboard');
	};

	// Desktop: permanently minimized vertical list with styling from VerticalNav
	if (isLarge) {
		return (
			<div className="bg-white/90 dark:bg-[#0c0a1a] border border-[#6229b3]/10 dark:bg-gradient-to-br from-gray-50/10 from-10% to-white/1 dark:border-[#c2a7fb]/20 shadow-[0_8px_30px_rgba(98,41,179,0.08)] h-full flex flex-col w-15 rounded-full">
				{/* Back button at top */}
				<div className="flex justify-center py-4 border-b border-[#6229b3]/10 dark:border-[#c2a7fb]/20">
					<button
						className="w-8 h-8 flex items-center justify-center text-[#4c1f8e]/80 dark:text-purple-200/80 hover:text-white hover:bg-[#6229b3]/50 rounded-full transition-colors"
						onClick={handleBackClick}
						title="Go back"
					>
						<FaChevronLeft size={16} />
					</button>
				</div>

				{/* Navigation Links (always minimized) */}
				<nav className="py-6 flex-grow">
					<ul className="space-y-4">
						{/* Info Link - normal styling (not active) */}
						<li className="px-3">
							<NavLink
								to={`/workspace/${projectName}/${projectId}`}
								className="flex items-center justify-center p-2 rounded-full transition-all text-[#4c1f8e] dark:text-purple-200 hover:bg-[#6229b3]/20 dark:hover:bg-[#c2a7fb]/10"
								title="Info"
							>
								<span className="text-xl"><FaInfoCircle /></span>
							</NavLink>
						</li>

						{/* Other menu items with #8236ec background when active */}
						{subroutes.map((item) => (
							<li key={item.path} className="px-3">
								<NavLink
									to={item.path}
									className={({ isActive }) =>
										`flex items-center justify-center p-2 rounded-full transition-all ${isActive
											? 'bg-[#8236ec] text-white shadow-sm dark:bg-[#8236ec]/50'
											: 'text-[#4c1f8e] dark:text-purple-200 hover:bg-[#6229b3]/20 dark:hover:bg-[#c2a7fb]/10'
										}`
									}
									title={item.name}
								>
									<span className="text-xl">{item.icon}</span>
								</NavLink>
							</li>
						))}
					</ul>
				</nav>

				{/* User Profile Section (minimized) */}
				<div className="py-2 px-1">
					<div className="flex justify-center">
						{/* Avatar or 'G' fallback */}
						<Link to={"/dashboard"}>
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
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Mobile: compact bottom nav matching VerticalNav styling
	return (
		<div className="fixed bottom-0 py-3 inset-x-0 z-50 
			border-t border-[#6229b3]/15 dark:border-[#c2a7fb]/20
			bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75
			dark:bg-[#0c0a1a] dark:bg-gradient-to-t dark:from-gray-50/10 dark:from-10% dark:to-white/1"
		>
			<nav className="max-w-7xl mx-auto px-2">
				<ul className="grid grid-cols-5 gap-1 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
					{/* Info Link - normal styling */}
					<li className="flex">
						<NavLink
							to={`/workspace/${projectId}`}
							className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition text-gray-600 dark:text-gray-300 hover:bg-[#6229b3]/10 dark:hover:bg-[#c2a7fb]/10"
							title="Info"
						>
							<span className="text-xl"><FaInfoCircle /></span>
						</NavLink>
					</li>

					{/* Other menu items with #8236ec color scheme when active */}
					{subroutes.map((item) => (
						<li key={item.path} className="flex justify-center">
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`flex justify-center items-center w-12 h-12 rounded-full py-2 text-sm transition ${isActive
										? 'text-[#8236ec] dark:text-purple-200 bg-[#8236ec]/15 dark:bg-[#8236ec]/30'
										: 'text-gray-600 dark:text-gray-300 hover:bg-[#6229b3]/10 dark:hover:bg-[#c2a7fb]/10'
									}`
								}
								title={item.name}
							>
								<span className="text-xl">{item.icon}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default WorkspaceNav;
