import { createSlice } from '@reduxjs/toolkit';

const getInitialMode = () => {
	// prefers stored value, falls back to system preference
	try {
		const saved = localStorage.getItem('theme');
		if (saved === 'dark' || saved === 'light') return saved;
	} catch {}
	if (typeof window !== 'undefined' && window.matchMedia) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return 'light';
};

const themeSlice = createSlice({
	name: 'theme',
	initialState: { mode: getInitialMode() },
	reducers: {
		setTheme: (state, action) => {
			const mode = action.payload === 'dark' ? 'dark' : 'light';
			state.mode = mode;
		},
		toggleTheme: (state) => {
			state.mode = state.mode === 'dark' ? 'light' : 'dark';
		},
	},
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme.mode;
export default themeSlice.reducer;
