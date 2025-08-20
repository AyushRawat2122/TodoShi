import React from 'react';
import useTheme from '../hooks/useTheme';
import { LuSun, LuMoon } from 'react-icons/lu';

const ThemeSwitch = ({ vertical = false, className = '' }) => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<div
			className={`${vertical ? 'rotate-90 my-4' : ''} ${className}`}
		>
			<button
				type="button"
				aria-label="Toggle theme"
				aria-pressed={isDark}
				onClick={toggleTheme}
				className={`relative inline-flex h-6 w-12 items-center rounded-full p-1 outline-none
					ring-1 ring-inset ring-gray-400/30 dark:ring-white/30
					bg-purple-100 dark:bg-gray-500/10 shadow-sm
					focus-visible:ring-2 focus-visible:ring-gray-400/40 dark:focus-visible:ring-white/40`}
			>
				<span
					className={`h-5 w-5 rounded-full bg-gray-50 dark:bg-gray-50/5 shadow-sm transition-transform duration-300 flex items-center justify-center relative
						${isDark ? 'translate-x-5' : 'translate-x-0'}`}
				>
					{/* Sun (light) */}
					<i
						className={`transition-all duration-300 text-yellow-500 ${isDark ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
					>
						<LuSun size={14} style={{ strokeWidth: 2.2 }} />
					</i>
					{/* Moon (dark) */}
					<i
						className={`absolute transition-all duration-300 text-slate-200 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}`}
					>
						<LuMoon size={14} style={{ strokeWidth: 2.2 }} className={`${vertical ? '-rotate-90' : ''}`} />
					</i>
				</span>
			</button>
		</div>
	);
};

export default ThemeSwitch;
