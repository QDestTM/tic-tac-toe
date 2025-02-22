import { GestureResponderEvent, NativeTouchEvent } from 'react-native'
import { StyleSheet, View, Easing, Animated } from 'react-native'

import React, { useState, useRef, useEffect } from 'react'
import { MutableRefObject } from 'react'

import XSymbol from './XSymbol'
import OSymbol from './OSymbol'

const ANGLE_STEP: number = 90
const DX_EDGE: number = 6

type Props = {
	turnIndex: number,
	onSymbolSelect: (symbol: string) => void
}


type Members = {
	rotation : number,

	deltaX : number,
	lastX : number
}


function SymbolWheel({ turnIndex, onSymbolSelect }: Props)
{
	const rotationValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const dxValueRef: MutableRefObject<Animated.Value> = useRef(null)

	const membersRef: MutableRefObject<Members> = useRef(null)

	// Initializing refs
	if ( rotationValueRef.current === null ) {
		rotationValueRef.current = new Animated.Value(0)
	}

	if ( dxValueRef.current === null ) {
		dxValueRef.current = new Animated.Value(0)
	}

	if ( membersRef.current === null ) {
		membersRef.current = { deltaX : 0, lastX : 0, rotation : 0 }
	}

	// States
	const [ rotation, setRotation ] = useState(0)

	// Updating ref state
	membersRef.current.rotation = rotation

	// Hooks
	useEffect(() => {
		const rtValue: Animated.Value = rotationValueRef.current
		const dxValue: Animated.Value = dxValueRef.current

		// Connecting listeners
		const rtListener = rtValue.addListener(({value}) => {
			setRotation(value)
		})

		const dxListener = dxValue.addListener(({value}) => {
			const newRotation = ClampRotation(rotation + value)
			setRotation(newRotation)
		})

		// Returning dismount callback
		return () => {
			rtValue.removeListener(rtListener)
			dxValue.removeListener(dxListener)
		}
	})

	// Functions
	function ClampRotation(rotation: number)
	{
		return ((rotation % 360) + 360) % 360
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

		animation.start()
	}

	// Handlers
	function HandleTouchStart(event: GestureResponderEvent)
	{
		const members: Members = membersRef.current

		rotationValueRef.current.stopAnimation()
		dxValueRef.current.stopAnimation()

		const move: NativeTouchEvent = event.nativeEvent
		members.lastX = move.pageX
	}


	function HandleTouchMove(event: GestureResponderEvent)
	{
		const members: Members = membersRef.current

		const move: NativeTouchEvent = event.nativeEvent
		const lastX: number = members.lastX

		// Applying rotation
		let dx: number = (move.pageX - lastX) / 2
		let rt: number = ClampRotation(rotation + dx)

		members.lastX = move.pageX
		members.deltaX = dx

		setRotation(rt)
	}


	function HandleTouchEnd(event: GestureResponderEvent)
	{
		const dx: number = membersRef.current.deltaX

		// Just snap rotation of dx too small
		if ( Math.abs(dx) < DX_EDGE ) {
			return AnimateSnapRotation()
		}

		// Animating wheel rotation
		dxValueRef.current.setValue(dx)

		const animation = Animated.timing(
			dxValueRef.current,
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
		if ( finished === true )
		{
			AnimateSnapRotation()
		}
	}

	// Rendering calculations
	const canRotate: boolean = turnIndex === 0

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
			<View key='wdispc-0' style={[style.container, style.containerH]}>
				<View key='wdisp-0' style={[style.display, style.displayBeg]}>
					<XSymbol/>
				</View>
				<View key='wdisp-1' style={[style.display, style.displayEnd]}>
					<XSymbol/>
				</View>
			</View>

			{/* Vertical wheel container with a symbols display */}
			<View key='wdispc-1' style={[style.container, style.containerV]}>
				<View key='wdisp-2' style={[style.display, style.displayBeg]}>
					<OSymbol/>
				</View>
				<View key='wdisp-3' style={[style.display, style.displayEnd]}>
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
		borderColor : 'lightseagreen',

		backgroundColor : 'teal'
	},

	circle : {
		width : '25%',
		aspectRatio : 1,

		borderRadius : '100%',
		borderWidth : 10,
		borderColor : 'lightseagreen',

		backgroundColor : 'powderblue'
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

		borderColor : 'burlywood',
		backgroundColor : 'linen'
	},

	displayBeg : {
		alignSelf : 'flex-start'
	},

	displayEnd : {
		alignSelf : 'flex-end'
	}
})


export default SymbolWheel;