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
	CircularProgress
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

	onStreetNoise, onChangeCity,

	onRadioNext, onRadioPrev,
	onRadioVolume, onRadioTogglePlay
}) => {

	const [area, setArea] = useState('');
	const [isVisible, setIsVisible] = useState(true)

	const handleChangeArea = (event) => {
		setArea(event.target.value);
	};

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
					<Grid container spacing={3}>
						<Grid item sm={12} lg={2}>
							<div className="h-full flex items-center">
								<Typography>Text</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} lg={2}>
							<div className="h-full flex items-center justify-center">
								<FormControl variant="outlined" className='w-full'>
									<InputLabel id="select-city-label">City</InputLabel>
									<Select
										label="City"
										id="select-city"
										labelId="select-city-label"
										value={video.city}
										onChange={e => onChangeCity(e.target.value)}
									>
										{video.cities.map((city, cityIndex) => (
											<MenuItem
												key={cityIndex}
												value={city.name}
											>
												{city.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} lg={2}>
							<div className="h-full flex items-center justify-center">
								<FormControl variant="outlined" className='w-full'>
									<InputLabel id="select-area-label">Area</InputLabel>
									<Select
										labelId="select-area-label"
										id="select-area"
										value={area}
										onChange={handleChangeArea}
										label="Area"
									>
										<MenuItem value={10}>Ten</MenuItem>
										<MenuItem value={20}>Twenty</MenuItem>
										<MenuItem value={30}>Thirty</MenuItem>
									</Select>
								</FormControl>
							</div>
						</Grid>
						<Grid item xs={12} lg={2}>
							<div className="control__noise h-full flex items-center justify-center">
								<Typography className='ws-nowrap'>Street Noise</Typography>
								<Button
									color="primary"
									variant="contained"
									onClick={() => onStreetNoise && onStreetNoise()}
								>
									{video.isMuted ? 'OFF' : 'ON'}
								</Button>
							</div>
						</Grid>
						<Grid item xs={12} lg={4}>
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
										{!radio.isLoading
											? <IconButton
												size='small'
												aria-label="play"
												onClick={() => onRadioTogglePlay()}
											>
												{radio.isPlaying
													? <PauseIcon fontSize='large' />
													: <PlayArrowIcon fontSize='large' />
												}
											</IconButton>
											: <CircularProgress size={35} />
										}
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
