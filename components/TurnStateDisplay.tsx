import { StyleSheet, View, Text, Animated, Easing } from "react-native"
import { useEffect, useRef, useState } from "react"
import React, { MutableRefObject } from "react"

import { TurnState } from "../models/TurnTypes"
import SymbolDisplay from "./SymbolDisplay"

import TransitionButton from "./TransitionButton"
import ColorInterpolate from 'color-interpolate'
import StateGridBox from "./StateGridBox"

import { COLOR_SECONDARY_0 } from "../Shared"
import { COLOR_SECONDARY_1 } from "../Shared"
import { COLOR_SECONDARY_2 } from "../Shared"
import { D, N, O, X, lerp } from "../Shared"

const BCG_COLORMAP = ColorInterpolate([COLOR_SECONDARY_0, COLOR_SECONDARY_1])

const BORDER_RADIUS_N = 20 // N - Normal state
const BORDER_RADIUS_S = 40 // S - Select state
const ASPECT_DEFAULT = 0.5 // When visible
const TRANSLATE_S = 15 // When selected

type Props = {
	turnIndex: number,
	turnState?: TurnState,
	selected?: boolean,

	onTurnSelect: (index: number) => void
}

type SelectState = {
	borderRad: number,
	translate: number
}


// Functions
function CreateSelectState(): SelectState
{
	return {
		borderRad : 0,
		translate : 0
	}
}


function GetStateText(index: number, state?: TurnState)
{
	if ( !state ) return ''
	if ( !index ) return "Start!"

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
function TurnStateDisplay({
	turnIndex, turnState, onTurnSelect, selected = false}: Props)
{
	const displayValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const selectValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const aspectValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( displayValueRef.current === null ) {
		displayValueRef.current = new Animated.Value(0)
	}
	if ( selectValueRef.current === null ) {
		selectValueRef.current = new Animated.Value(0)
	}
	if ( aspectValueRef.current === null ) {
		aspectValueRef.current = new Animated.Value(0)
	}

	// States
	const [ selectState, setSelectState ] = useState(CreateSelectState)
	const [ backColor, setBackColor ] = useState(COLOR_SECONDARY_0)
	const [ stateText, setStateText ] = useState('')

	const [ aspectRatio, setAspectRatio ] = useState(0)
	const [ display, setDisplay ] = useState(0)

	// Hooks
	useEffect(() => {
		const displayValue: Animated.Value = displayValueRef.current
		const selectValue: Animated.Value = selectValueRef.current
		const aspectValue: Animated.Value = aspectValueRef.current

		const selectListener = selectValue.addListener(({value}) => {
			// Calculating border radius state
			const borderRad: number = lerp(BORDER_RADIUS_N, BORDER_RADIUS_S, value)

			// Calculating translate value state
			const translate: number = TRANSLATE_S * value

			// Updating select state
			setSelectState({borderRad, translate})
		})

		const displayListener = displayValue.addListener(({value}) => {
			setDisplay(value)
		})

		const aspectListener = aspectValue.addListener(({value}) => {
			setAspectRatio(value)
		})

		// Returning dismount callback
		return () => {
			displayValue.removeListener(displayListener)
			selectValue.removeListener(selectListener)
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
		setStateText( GetStateText(turnIndex, turnState) )
	},
		[turnState]
	)


	useEffect(() => {
		var animation: Animated.CompositeAnimation

		if ( selected ) // Animate IN
		{
			animation = Animated.timing(
				selectValueRef.current,
				{
					toValue : 1,
					duration : 500,
					easing : Easing.out(Easing.quad),
					useNativeDriver : false
				}
			)
		}
		else // Animate OUT
		{
			animation = Animated.timing(
				selectValueRef.current,
				{
					toValue : 0,
					duration : 1000,
					easing : Easing.out(Easing.quad),
					useNativeDriver : false
				}
			)
		}

		animation.start()
	},
		[selected]
	)

	// Handlers
	function HandleTouchAnimation(value: number)
	{
		setBackColor( BCG_COLORMAP(value) )
	}


	function HandleTouchInput()
	{
		onTurnSelect(turnIndex)
	}

	// Styles
	const mainStyle = StyleSheet.compose(style.main,
		{ aspectRatio,
			paddingHorizontal : `${display * 3}%`,
			top               : selectState.translate
		}
	)

	const contentStyle = {
		...style.content,
		opacity         : display,
		borderRadius    : selectState.borderRad,
		backgroundColor : backColor
	}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<Animated.View style={contentStyle}>
				<TransitionButton
					touchDuration={1000}
					touchEasing={Easing.out(Easing.quad)}

					onTouchAnimation={HandleTouchAnimation}
					onTouchInput={HandleTouchInput}
				>
					<View style={[style.container, style.container0]}>
						<Text>{stateText}</Text>
					</View>
					<View style={[style.container, style.container1]}>
						{
							turnState ? <StateGridBox turnState={turnState}/> : null
						}
					</View>
					<View style={[style.container, style.container2]}>
						<SymbolDisplay symbol={turnState?.winner}/>
					</View>
				</TransitionButton>
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
		borderColor : COLOR_SECONDARY_2,

		flexDirection : 'column',
		alignItems : 'stretch',
		justifyContent : 'center',

		backgroundColor : COLOR_SECONDARY_0
	},

	// Containers
	container : {
		alignItems : 'center',
		justifyContent : 'center'
	},

	container0 : {
		flex : 1
	},

	container1 : {
		flex : 3
	},

	container2 : {
		flex : 2,

		padding : '10%'
	}
})


export default TurnStateDisplay;