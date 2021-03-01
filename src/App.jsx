import React, { useState } from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Control from './components/Control'
import ReactPlayer from 'react-player';
import mui from './plugins/materialui';

import {
	radios as radiosData,
	cities as citiesData,
	areas as areasData
} from './data'

const App = () => {

	//Initializing dark theme
	const theme = React.useMemo(() => createMuiTheme(mui.getTheme()), []);

	const [player, setPlayer] = useState(null)

	const [cities] = useState(citiesData)
	const [city, setCity] = useState(cities[0])

	const [areas] = useState(areasData)
	const [cityAreas, setCityAreas] = useState(
		areas.filter(
			a => a.cityId === city.id
		)
	)
	const [area, setArea] = useState(areas[0])

	// Video States
	const [video, setVideo] = useState({
		loop: true,
		volume: 0.9,
		isMuted: true,
		playbackRate: 1,
		wasMuted: true,
		showNoise: true,
		controls: false,
		isPlaying: false,
	})

	// Radio states
	const [radios] = useState(radiosData)
	const [radio, setRadio] = useState({
		...radios.find(
			r => r.areaId === area.id
		),
		volume: 0.05,
		isPlaying: false,
		isLoading: true,
		isMuted: false,
	})

	// it's just a helper function
	// instead of calling setVideo(video => ({...video,...changes}))
	// we can simply call _setVideo({...})
	const _setVideo = (changes) => {
		setVideo(prevVideo => ({
			...prevVideo,
			...changes
		}))
	}

	// it's a helper fuction like _setVideo
	const _setRadio = (changes) => {
		setRadio(prevRadio => ({
			...prevRadio,
			...changes
		}))
	}

	const getRadios = areaId => {
		return radios.filter(
			r => r.areaId === areaId
		)
	}

	// Changing to new video
	const handleChangeCity = (cityId) => {
		setCity(cities.find(city => city.id === cityId))
		const newAreas = areas.filter(area => area.cityId === cityId)
		const newArea = newAreas[0]

		setCityAreas(newAreas)
		setArea(newAreas[0])

		const areaRadios = getRadios(newArea.id)
		if (areaRadios.length) _setRadio({ ...areaRadios[0] })
		else _setRadio({
			url: '', isPlaying: false,
			name: 'No radio in this area'
		})

		if (player) player.seekTo(40)
	}

	const handleChangeArea = areaId => {
		setArea(cityAreas.find(area => area.id === areaId))

		const areaRadios = getRadios(areaId)
		if (areaRadios.length) _setRadio({ ...areaRadios[0] })
		else _setRadio({
			url: '', isPlaying: false,
			name: 'No radio in this area'
		})

		if (player) player.seekTo(40)
	}

	const handleYTPlayerOnReady = player => {
		setPlayer(player)
		player.seekTo(40)
		_setVideo({
			isPlaying: true,
			isMuted: video.wasMuted,
		})
	}

	const handleRadioChange = ({ isNext, isPrev }) => {

		const areaRadios = getRadios(area.id)

		if (!areaRadios.length) return

		// Finding index of currently playing radio index
		let cIndex = areaRadios.findIndex(r => r.id === radio.id)

		// Returning is there is no radio found
		if (cIndex === -1) return

		// Incrementing on decrementing current radio index
		cIndex = isPrev ? cIndex - 1 : isNext ? cIndex + 1 : cIndex

		// Fixing current index if it goes out of bound of radios array
		cIndex = cIndex < 0 ? areaRadios.length - 1 : cIndex >= areaRadios.length ? 0 : cIndex

		// Setting the new radio of current index
		_setRadio({ ...areaRadios[cIndex], isLoading: true })
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<Control

				radio={radio}
				video={video}

				city={city}
				area={area}
				cities={cities}
				areas={cityAreas}

				onChangeCity={handleChangeCity}
				onChangeArea={handleChangeArea}
				onPlaybackRate={playbackRate => _setVideo({ playbackRate })}
				onStreetNoise={() => _setVideo({ isMuted: !video.isMuted })}

				onRadioVolume={v => _setRadio({ volume: v })}
				onRadioNext={() => handleRadioChange({ isNext: true })}
				onRadioPrev={() => handleRadioChange({ isPrev: true })}
				onRadioTogglePlay={() => _setRadio({ isPlaying: !radio.isPlaying })}
			/>

			<div className="yt-player">
				<ReactPlayer
					width='100%'
					height='100%'
					url={area.video}
					loop={video.loop}
					volume={video.volume}
					muted={video.isMuted}
					playing={video.isPlaying}
					controls={video.controls}
					onReady={handleYTPlayerOnReady}
					playbackRate={video.playbackRate}
					onBuffer={() => _setVideo({ showNoise: true })}
					onBufferEnd={() => _setVideo({ showNoise: false })}
				/>
				{video.showNoise && <div className='yt-player__noise' />}
			</div>

			<ReactPlayer
				url={radio.url}
				muted={radio.isMuted}
				volume={radio.volume}
				playing={radio.isPlaying}
				onBuffer={() => _setRadio({ isLoading: true })}
				onBufferEnd={() => _setRadio({ isLoading: false })}
				onReady={() => _setRadio({ isLoading: false, isPlaying: true })}
				className='radio-player'
			/>

		</ThemeProvider>
	);
}

export default App;
