import { View, StyleSheet, Animated, Easing } from 'react-native'

import { useState, useEffect, useRef } from 'react';
import { MutableRefObject } from 'react';

import { COLOR_SECONDARY_0 } from '../Shared';
import { COLOR_SECONDARY_1 } from '../Shared';
import { COLOR_SECONDARY_2 } from '../Shared';
import { COLOR_SECONDARY_3 } from '../Shared';
import { lerp, N, D } from '../Shared';

import TransitionButton from './TransitionButton';
import ColorInterpolate from 'color-interpolate'
import { SquareState } from '../models/BaseTypes';
import SymbolDisplay from './SymbolDisplay';

const BORDER_RADIUS_N = 15 // N - Normal state
const BORDER_RADIUS_P = 35 // P - Pressed state

const BCG_COLORMAP = ColorInterpolate([COLOR_SECONDARY_0, COLOR_SECONDARY_1])
const WIN_COLORMAP = ColorInterpolate([COLOR_SECONDARY_0, COLOR_SECONDARY_3])

type Props = {
	skey: string,
	state : SquareState

	onTouchInput: (skey: string) => void,
}


function Square({ skey, state, onTouchInput }: Props)
{
	const winnerValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs-
	if ( winnerValueRef.current === null ) {
		winnerValueRef.current = new Animated.Value(0)
	}

	// States
	const [ backgroundColor, setBackgroundColor ] = useState(COLOR_SECONDARY_0)
	const [ borderRadius, setBorderRadius ] = useState(BORDER_RADIUS_N)

	// Hooks
	useEffect(() => {
		const winnerValue: Animated.Value = winnerValueRef.current

		const winnerListener = winnerValue.addListener(({ value }) => {
			// Updating background color state
			const color: string = WIN_COLORMAP(value)
			setBackgroundColor(color)

			// Updating border radius state
			const radius: number = BORDER_RADIUS_N + (100 - BORDER_RADIUS_N) * value
			setBorderRadius(radius)
		})

		// Returning dismount callback
		return () => {
			winnerValue.removeListener(winnerListener)
		}
	})


	useEffect(() => {
		if ( state.winner === D ) return

		const inPattern: boolean = state.pattern.includes(skey)
		let easing = Easing.out(Easing.quad) // OUT

		let toValue: number = 0;
		let delay  : number = 0

		if ( state.winner !== N && inPattern ) // IN
		{
			toValue = 1; delay = 1000
			easing = Easing.bounce
		}

		// Starting animation
		const animation = Animated.timing(
			winnerValueRef.current,
			{
				toValue, delay, easing,
				duration : 1000,
				useNativeDriver : false
			}
		)

		animation.start()
	},
		[state.winner]
	)

	// Handlers
	function HandleTouchAnimation(value: number)
	{
		// Updating background color state
		const color: string = BCG_COLORMAP(value)
		setBackgroundColor(color)

		// Updating border radius state
		const radius: number = lerp(BORDER_RADIUS_N, BORDER_RADIUS_P, value)
		setBorderRadius(radius)
	}


	function HandleTouchInput()
	{
		onTouchInput(skey)
	}

	// Rendering calculations
	const ignoreTouch = state.symbol !== D || state.winner !== N
	const boxStyle = {...style.box, backgroundColor,
		borderRadius : `${borderRadius}%`
	}

	// Rendering JSX component
	return (
		<View style={style.main}>
			<TransitionButton
				touchDuration={1000}
				touchEasing={Easing.bounce}
				ignoreTouch={ignoreTouch}

				onTouchAnimation={HandleTouchAnimation}
				onTouchInput={HandleTouchInput}
			>
				<Animated.View style={boxStyle}>
					<SymbolDisplay
						key={`sdisp-${skey}`}
						hiddenSymbols={[D]}
						symbol={state.symbol}
					/>
				</Animated.View>
			</TransitionButton>
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '33.33%',
		height : '33.33%'
	},

	box : {
		flex : 1,
		margin : '3%',

		alignItems : 'center',
		justifyContent : 'center',

		borderWidth : 6,
		borderStyle : 'solid',

		borderColor : COLOR_SECONDARY_2,
	}
})

export default Square;