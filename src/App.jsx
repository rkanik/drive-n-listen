import React, { useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Control from './components/Control'
import ReactPlayer from 'react-player';
import mui from './plugins/materialui';

import {
	radios as radiosData,
	videos as videosData
} from './data'

const App = () => {

	// Initializing dark theme
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const theme = React.useMemo(
		() => createMuiTheme(
			mui.getTheme(prefersDarkMode)
		),
		[prefersDarkMode],
	);

	// Video States
	const [videos] = useState(videosData)
	const [video, setVideo] = useState({
		...videosData[0],
		loop: true,
		volume: 0.9,
		isMuted: true,
		playbackRate: 1,
		wasMuted: true,
		showNoise: true,
		controls: false,
		isPlaying: false,
		cities: videos.map(v => ({
			value: v.city,
			name: v.city
		}))
	})

	// Radio states
	const [radios] = useState(radiosData)
	const [radio, setRadio] = useState({
		...radios.find(r => r.cityId === video.id),
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

	const getRadios = cityId => {
		return radios.filter(
			r => r.cityId === cityId
		)
	}

	// Changing to new video
	const handleChangeCity = (city) => {
		let newVideo = videos.find(
			video => video.city === city
		)
		_setVideo({
			...newVideo,
			isMuted: true,
			showNoise: true,
			wasMuted: video.isMuted,
		})
		_setRadio({
			...getRadios(
				newVideo.id
			)[0]
		})
	}

	const handleYTPlayerOnReady = () => {
		_setVideo({
			isPlaying: true,
			isMuted: video.wasMuted,
		})
	}

	const handleRadioChange = ({ isNext, isPrev }) => {

		const cityRadios = getRadios(video.id)

		// Finding index of currently playing radio index
		let cIndex = cityRadios.findIndex(r => r.id === radio.id)

		// Returning is there is no radio found
		if (cIndex === -1) return

		// Incrementing on decrementing current radio index
		cIndex = isPrev ? cIndex - 1 : isNext ? cIndex + 1 : cIndex

		// Fixing current index if it goes out of bound of radios array
		cIndex = cIndex < 0 ? cityRadios.length - 1 : cIndex >= cityRadios.length ? 0 : cIndex

		// Setting the new radio of current index
		_setRadio({ ...cityRadios[cIndex], isLoading: true })
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<Control

				radio={radio}
				video={video}

				onChangeCity={handleChangeCity}
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
					url={video.url}
					loop={video.loop}
					volume={video.volume}
					muted={video.isMuted}
					playing={video.isPlaying}
					controls={video.controls}
					playbackRate={video.playbackRate}
					onBuffer={() => _setVideo({ showNoise: true })}
					onBufferEnd={() => _setVideo({ showNoise: false })}
					onReady={handleYTPlayerOnReady}
				/>
				{video.showNoise && <div className='yt-player__noise' />}
			</div>

			<ReactPlayer
				url={radio.url}
				playing={radio.isPlaying}
				volume={radio.volume}
				muted={radio.isMuted}
				onBuffer={() => _setRadio({ isLoading: true })}
				onBufferEnd={() => _setRadio({ isLoading: false })}
				onReady={() => _setRadio({ isLoading: false, isPlaying: true })}
				className='radio-player'
			/>

		</ThemeProvider>
	);
}

export default App;
