const mui = {
	getTheme(darkMode) {
		return {
			palette: {
				primary: {
					light: '#673ab7',
					main: '#673ab7',
					dark: '#673ab7',
					contrastText: '#fff',
				},
				secondary: {
					light: '#d500f9',
					main: '#d500f9',
					dark: '#d500f9',
					contrastText: '#fff',
				},
				type: darkMode ? 'dark' : 'light',
			}
		}
	}
}

export default mui