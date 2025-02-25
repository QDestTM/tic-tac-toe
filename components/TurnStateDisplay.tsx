import { StyleSheet, View, Text, Animated, Easing } from "react-native"
import { MutableRefObject, useEffect, useRef, useState } from "react"

import { TurnState } from "../models/TurnTypes"
import { D, N, O, X } from "../Shared"

const ASPECT_DEFAULT: number = 0.5

type Props = {
	turnIndex: number,
	turnState: TurnState | undefined,

	onTurnSelect: (index: number) => void
}


// Functions
function GetStateText(state: TurnState, index: number)
{
	if ( index === 0 ) {
		return "Start!"
	}

	switch (state.winner)
	{
		case D:
			return "Draw!"
		case X:
			return "Winner X!"
		case O:
			return "Winner O!"
		case N:
			return `Turn ${index}`
	}

	return "Unknown"
}


// Main components
function TurnStateDisplay({ turnIndex, turnState, onTurnSelect }: Props)
{
	const displayValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const aspectValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( displayValueRef.current === null ) {
		displayValueRef.current = new Animated.Value(0)
	}
	if ( aspectValueRef.current === null ) {
		aspectValueRef.current = new Animated.Value(0)
	}

	// States
	const [ aspectRatio, setAspectRatio ] = useState(0)
	const [ stateText, setStateText ] = useState('')

	const [ display, setDisplay ] = useState(0)

	// Hooks
	useEffect(() => {
		const displayValue: Animated.Value = displayValueRef.current
		const aspectValue: Animated.Value = aspectValueRef.current

		const displayListener = displayValue.addListener(({value}) => {
			setDisplay(value)
		})

		const aspectListener = aspectValue.addListener(({value}) => {
			setAspectRatio(value)
		})

		// Returning dismount callback
		return () => {
			displayValue.removeListener(displayListener)
			aspectValue.removeListener(aspectListener)
		}
	})


	useEffect(() => {
		var animations: Animated.CompositeAnimation[]

		if ( turnState ) // Show Animations
		{
			animations = [
				Animated.timing(
					aspectValueRef.current,
					{
						toValue : ASPECT_DEFAULT,
						duration : 500,
						delay : 0,
						easing : Easing.out(Easing.quad),
						useNativeDriver : false
					}
				),

				Animated.timing(
					displayValueRef.current,
					{
						toValue : 1,
						duration : 500,
						delay : 200,
						easing : Easing.out(Easing.quad),
						useNativeDriver : false
					}
				)
			]
		}
		else // Hide Animations
		{
			animations = [
				Animated.timing(
					aspectValueRef.current,
					{
						toValue : 0,
						duration : 500,
						delay : 200,
						easing : Easing.out(Easing.quad),
						useNativeDriver : false
					}
				),
	
				Animated.timing(
					displayValueRef.current,
					{
						toValue : 0,
						duration : 500,
						delay : 0,
						easing : Easing.out(Easing.quad),
						useNativeDriver : false
					}
				)
			]
		}

		// Starting animations
		Animated.parallel(animations, { stopTogether : false }).start()

		// Updating state text
		setStateText(turnState ? GetStateText(turnState, turnIndex) : '')
	},
		[turnState]
	)

	// Handlers
	function HandleTouchEnd()
	{
		onTurnSelect(turnIndex)
	}

	// Styles
	const mainStyle = StyleSheet.compose(style.main,
		{ aspectRatio, paddingHorizontal : `${display * 3}%` })

	const contentStyle = {...style.content, opacity : display }

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<Animated.View
				style={contentStyle}
				onTouchEnd={HandleTouchEnd}
			>
				<View style={style.container0}>
					<Text>{stateText}</Text>
				</View>
				<View style={style.container1}>

				</View>
				<View style={style.container2}>

				</View>
			</Animated.View>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		height : '100%'
	},

	content : {
		flex : 1,

		borderRadius : 20,
		borderWidth : 5,
		borderColor : 'burlywood',

		flexDirection : 'column',
		alignItems : 'stretch',
		justifyContent : 'center',

		backgroundColor : 'linen'
	},

	// Containers
	container0 : {
		flex : 1,

		alignItems : 'center',
		justifyContent : 'center'
	},

	container1 : {
		flex : 2
	},

	container2 : {
		flex : 2
	}
})


export default TurnStateDisplay;