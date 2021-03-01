import { useState } from 'react';
import {
	Grid,
	Select,
	Container,
	Typography,
	FormControl,
	InputLabel,
	MenuItem,
	IconButton,
	Slider,
	Button,
	//CircularProgress
} from '@material-ui/core';

import {
	Pause as PauseIcon,
	SkipNext as SkipNextIcon,
	PlayArrow as PlayArrowIcon,
	SkipPrevious as SkipPreviousIcon,
	Visibility as VisibilityIcon
} from '@material-ui/icons'

// Stylesheet
import '../assets/scss/components/control.scss'


const Control = ({
	radio, video,

	city, area,
	cities, areas,

	onStreetNoise, onChangeCity,
	onPlaybackRate, onChangeArea,

	onRadioNext, onRadioPrev,
	onRadioVolume, onRadioTogglePlay
}) => {

	const [playbackRates] = useState([
		{ value: 1, text: '1x' },
		{ value: 1.5, text: '1.5x' },
		{ value: 2, text: '2x' },
	]);
	const [isVisible, setIsVisible] = useState(true)

	return (
		<div className='control relative'>
			<div className='control__visibility'>
				<IconButton
					aria-label="visibility"
					onClick={() => setIsVisible(!isVisible)}
				>
					<VisibilityIcon />
				</IconButton>
			</div>
			<div className={`control__content${isVisible ? ' visible' : ''}`}>
				<Container>
					<Grid container spacing={5}>
						<Grid item sm={12} lg={2}>
							<div className="h-full flex items-center">
								<Typography variant='h6' className='ws-nowrap'>Drive and Listen</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3}>
							<div className='flex flex-col justify-center h-full'>
								<div className='flex items-center'>
									<Typography
										variant='body2'
										color='inherit'
										target='_blank'
										href={area.video}
										rel="noopener noreferrer"
										className='flex-none td-none'
										variantMapping={{ 'body2': 'a' }}
										style={{ width: '40%' }}
									>
										Video Source
									</Typography>
									<FormControl variant="outlined" className='w-full'>
										<InputLabel id="select-city-label">City</InputLabel>
										<Select
											label="City"
											id="select-city"
											labelId="select-city-label"
											value={city.id}
											onChange={e => onChangeCity(+e.target.value)}
										>
											{cities.map(city => (
												<MenuItem
													key={city.id}
													value={city.id}
												>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
								<div className='flex items-center mt-4'>
									<Typography
										variant='body2'
										className='flex-none'
										style={{ width: '40%' }}
									>
										Code Source
									</Typography>
									<FormControl variant="outlined" className='w-full'>
										<InputLabel id="select-area-label">Area</InputLabel>
										<Select
											labelId="select-area-label"
											id="select-area"
											value={area.id}
											onChange={e => onChangeArea(+e.target.value)}
											label="Area"
										>
											{areas.map(area => (
												<MenuItem
													key={area.id}
													value={area.id}
												>
													{area.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3}>
							<div className='h-full flex flex-col items-center justify-center'>
								<div className="control__noise h-full w-full flex items-center">
									<Typography
										variant='body2'
										className='ws-nowrap'
										style={{ width: '35%' }}
									>
										Street Noise
									</Typography>
									<Button
										color="primary"
										variant="contained"
										className='ml-auto'
										onClick={() => onStreetNoise && onStreetNoise()}
									>
										{video.isMuted ? 'OFF' : 'ON'}
									</Button>
								</div>
								<div className='control__speeds h-full w-full flex items-center mt-4 lg:mt-0'>
									<Typography
										variant='body2'
										className='ws-nowrap flex-none'
										style={{ width: '35%' }}
									>
										Speed
									</Typography>
									{playbackRates.map((rate, i) => (
										<Button
											size='small'
											color="primary"
											key={rate.value}
											variant={
												video.playbackRate === rate.value
													? "contained"
													: "outlined"
											}
											className={i === 0 ? 'ml-auto' : ''}
											onClick={() => onPlaybackRate(rate.value)}
										>
											{rate.text}
										</Button>
									))}
								</div>
							</div>
						</Grid>
						<Grid item xs={12} md={4}>
							<div className='audio'>
								<div className="audio__header">
									<Typography variant="subtitle1">{radio.name}</Typography>
								</div>
								<div className="audio__control">
									<div className='audio__buttons flex justify-between'>
										<div className="flex-none flex items-center">
											<IconButton
												size='small'
												aria-label="play-previous"
												onClick={() => onRadioPrev()}
											>
												<SkipPreviousIcon />
											</IconButton>
										</div>
										{/* {!radio.isLoading ?  */}
										<IconButton
											size='small'
											aria-label="play"
											onClick={() => onRadioTogglePlay()}
										>
											{radio.isPlaying
												? <PauseIcon fontSize='large' />
												: <PlayArrowIcon fontSize='large' />
											}
										</IconButton>
										{/* : <CircularProgress size={35} />
										} */}
										<div className="flex-none flex items-center">
											<IconButton
												size='small'
												aria-label="play-next"
												onClick={() => onRadioNext()}
											>
												<SkipNextIcon />
											</IconButton>
										</div>
									</div>
									<Slider
										value={radio.volume * 100}
										onChange={(_, v) => onRadioVolume(+(v / 100).toFixed(2))}
										aria-labelledby="audio-proggress"
									/>
								</div>
							</div>
						</Grid>
					</Grid>
				</Container>
			</div>
		</div>
	);
}

export default Control;
