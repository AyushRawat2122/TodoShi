import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode, setTheme as setThemeAction, toggleTheme as toggleThemeAction } from '../store/themeSlice';

const applyTheme = (mode) => {
	try {
		localStorage.setItem('theme', mode);
	} catch {}
	const root = document.documentElement;
	// Tailwind dark mode via 'dark' class
	if (mode === 'dark') {
		root.classList.add('dark');
		root.style.colorScheme = 'dark';
	} else {
		root.classList.remove('dark');
		root.style.colorScheme = 'light';
	}
};

const useTheme = () => {
	const dispatch = useDispatch();
	const mode = useSelector(selectThemeMode);

	useEffect(() => {
		if (mode) applyTheme(mode);
	}, [mode]);

	const setTheme = (next) => dispatch(setThemeAction(next === 'dark' ? 'dark' : 'light'));
	const toggleTheme = () => dispatch(toggleThemeAction());

	return {
		theme: mode,
		isDark: mode === 'dark',
		setTheme,
		toggleTheme,
	};
};

export default useTheme;
