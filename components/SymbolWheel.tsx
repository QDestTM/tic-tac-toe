import { GestureResponderEvent, NativeTouchEvent } from 'react-native'
import { StyleSheet, View, Easing, Animated } from 'react-native'

import { useState, useRef, useEffect, useContext } from 'react'
import { MutableRefObject } from 'react'

import { MatchState } from '../models/TurnTypes'
import { MatchContext } from '../Context'

import { COLOR_SECONDARY_0 } from '../Shared'
import { COLOR_SECONDARY_2 } from '../Shared'
import { COLOR_PRIMARY_0 } from '../Shared'
import { COLOR_PRIMARY_1 } from '../Shared'
import { COLOR_APP } from '../Shared'

import XSymbol from './symbols/XSymbol'
import OSymbol from './symbols/OSymbol'

const ANGLE_STEP: number = 90
const DX_TRACEHOLD: number = 6

const SECTOR_COUNT: number = 360 / ANGLE_STEP

type Props = {
	onSpinerStart: () => void,
	onOffsetChanged: (offset: number) => void
}

type Members = {
	rotation : number,
	offset   : number,
	deltaX   : number,
	lastX    : number
}


// Main components
function SymbolWheel({ onSpinerStart, onOffsetChanged }: Props)
{
	const rotationValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const deltaxValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const membersRef: MutableRefObject<Members> = useRef(null)

	// Initializing refs
	if ( rotationValueRef.current === null ) {
		rotationValueRef.current = new Animated.Value(0)
	}
	if ( deltaxValueRef.current === null ) {
		deltaxValueRef.current = new Animated.Value(0)
	}
	if ( membersRef.current === null ) {
		membersRef.current = {rotation : 0, offset : 0, deltaX : 0, lastX : 0}
	}

	// Context
	const matchState: MatchState = useContext(MatchContext)

	// States
	const [ rotation, setRotation ] = useState(0)

	// Updating ref state
	membersRef.current.rotation = rotation

	// Hooks
	useEffect(() => {
		const rotationValue: Animated.Value = rotationValueRef.current
		const deltaxValue: Animated.Value = deltaxValueRef.current

		// Connecting listeners
		const rotationListener = rotationValue.addListener(({value}) => {
			SetRotationFixed(value)
		})

		const deltaxListener = deltaxValue.addListener(({value}) => {
			SetRotationFixed(membersRef.current.rotation + value)
		})

		// Returning dismount callback
		return () => {
			rotationValue.removeListener(rotationListener)
			deltaxValue.removeListener(deltaxListener)
		}
	})


	useEffect(() => {
		AnimateSectionRotate(matchState.index)
	},
		[matchState.index]
	)

	// Functions
	function SetRotationFixed(rotation: number)
	{
		setRotation(((rotation % 360) + 360) % 360)
	}


	function AnimateSectionRotate(index: number)
	{
		const offset: number = membersRef.current.offset
		rotationValueRef.current.stopAnimation()

		// Calculating target rotation
		var toValue: number = -(index + offset) * ANGLE_STEP

		const animation = Animated.timing(
			rotationValueRef.current,
			{
				toValue, duration : 1000,
				easing : Easing.bounce,
				useNativeDriver : false
			}
		)

		animation.start()
	}


	function AnimateSnapRotation()
	{
		const members: Members = membersRef.current
		const rotation: number = members.rotation

		// Find target rotation value
		let toValue = Math.round(rotation / ANGLE_STEP) * ANGLE_STEP
		rotationValueRef.current.setValue(rotation)

		// Animating rotation to clothest angle
		const animation = Animated.timing(
			rotationValueRef.current,
			{
				toValue, duration : 1000,
				easing : Easing.bounce,
				useNativeDriver : false
			}
		)

		animation.start(({ finished }) => {
			if ( !finished ) return

			// Calculating selected sector number
			const sector: number = (toValue / ANGLE_STEP) % SECTOR_COUNT
			const offset: number = sector % 2

			// Invoking offset change event
			membersRef.current.offset = offset
			onOffsetChanged(offset)
		})
	}

	// Handlers
	function HandleTouchStart(event: GestureResponderEvent)
	{
		const move: NativeTouchEvent = event.nativeEvent
		const members: Members = membersRef.current

		// Stop all active animations
		rotationValueRef.current.stopAnimation()
		deltaxValueRef.current.stopAnimation()

		// Set lastX as touch x position
		members.lastX = move.pageX
	}


	function HandleTouchMove(event: GestureResponderEvent)
	{
		const members: Members = membersRef.current
		const move: NativeTouchEvent = event.nativeEvent

		// Applying rotation
		const dx: number = (move.pageX - members.lastX) / 2
		SetRotationFixed(rotation + dx)

		// Updating members values
		members.lastX = move.pageX
		members.deltaX = dx
	}


	function HandleTouchEnd(event: GestureResponderEvent)
	{
		onSpinerStart() // In any case leads to onSpinerStart call
		const dx: number = membersRef.current.deltaX

		// Just snap rotation if dx too small
		if ( Math.abs(dx) < DX_TRACEHOLD ) {
			return AnimateSnapRotation()
		}

		// Animating wheel spiner rotation
		deltaxValueRef.current.setValue(dx)

		const animation = Animated.timing(
			deltaxValueRef.current,
			{
				toValue : 0,
				duration : 4000,
				easing : Easing.out(Easing.quad),
				useNativeDriver : false
			}
		)

		animation.start(HandleRotationFinish)
	}


	function HandleRotationFinish({ finished }: Animated.EndResult)
	{
		SetRotationFixed(rotation) // Updating rotation state
		if ( finished ) AnimateSnapRotation()
	}

	// Rendering calculations
	const canRotate: boolean = matchState.index === 0

	// Styles
	const mainStyle = {...style.main,
		transform : [{rotate: `${rotation}deg`}]
	}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}
			onTouchStart={canRotate && HandleTouchStart}
			onTouchMove={canRotate && HandleTouchMove}
			onTouchEnd={canRotate && HandleTouchEnd}
		>
			<View style={style.circle}/> {/* Decorative circle in center */}

			{/* Horizontal wheel container with a symbols display */}
			<View style={[style.container, style.containerH]}>
				<View style={[style.display, style.displayBeg]}>
					<XSymbol/>
				</View>
				<View style={[style.display, style.displayEnd]}>
					<XSymbol/>
				</View>
			</View>

			{/* Vertical wheel container with a symbols display */}
			<View style={[style.container, style.containerV]}>
				<View style={[style.display, style.displayBeg]}>
					<OSymbol/>
				</View>
				<View style={[style.display, style.displayEnd]}>
					<OSymbol/>
				</View>
			</View>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '75%',
		aspectRatio : 1,

		marginTop: '5%',
		borderRadius : '100%',

		justifyContent : 'center',
		alignItems : 'center',

		borderWidth : 10,
		borderColor : COLOR_PRIMARY_1,

		backgroundColor : COLOR_PRIMARY_0
	},

	circle : {
		width : '25%',
		aspectRatio : 1,

		borderRadius : '100%',
		borderWidth : 10,
		borderColor : COLOR_PRIMARY_1,

		backgroundColor : COLOR_APP
	},

	// Flex containers for displays
	container : {
		width: '93%',
		aspectRatio: 1,

		position : 'absolute',
		justifyContent : 'center'
	},

	containerH : {
		flexDirection: 'row'
	},

	containerV : {
		flexDirection: 'column'
	},

	// Display containers for symbols
	display : {
		width : '33%',
		aspectRatio : 1,

		padding : '5%',
		position : 'absolute',

		borderWidth : 5,
		borderRadius : '100%',

		borderColor : COLOR_SECONDARY_2,
		backgroundColor : COLOR_SECONDARY_0
	},

	displayBeg : {
		alignSelf : 'flex-start'
	},

	displayEnd : {
		alignSelf : 'flex-end'
	}
})


export default SymbolWheel;