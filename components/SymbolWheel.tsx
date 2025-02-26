import { GestureResponderEvent, NativeTouchEvent } from 'react-native'
import { StyleSheet, View, Easing, Animated } from 'react-native'

import { useState, useRef, useEffect } from 'react'
import { MutableRefObject } from 'react'
import React from 'react'

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
	turnIndex: number,

	onSpinerStart: () => void,
	onOffsetChanged: (offset: number) => void
}

type Members = {
	offset : number,
	rotation : number,

	deltaX : number,
	lastX : number
}


function SymbolWheel({ turnIndex, onSpinerStart, onOffsetChanged }: Props)
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

	if ( membersRef.current === null )
	{
		membersRef.current = {
			rotation : 0,
			offset : 0,

			deltaX : 0,
			lastX  : 0,
		}
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
			setRotation(rotation + value)
		})

		// Returning dismount callback
		return () => {
			rtValue.removeListener(rtListener)
			dxValue.removeListener(dxListener)
		}
	},
		[rotation]
	)


	useEffect(() => {
		AnimateSectionRotate(turnIndex)
	},
		[turnIndex]
	)

	// Functions
	function ClampRotation(rotation: number)
	{
		return ((rotation % 360) + 360) % 360
	}


	function AnimateSectionRotate(id: number)
	{
		rotationValueRef.current.stopAnimation()

		const members: Members = membersRef.current
		const offset: number = members.offset

		// Calculating target rotation
		var toValue: number = -(id + offset) * ANGLE_STEP

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
			const members: Members = membersRef.current

			// Calculating offset and setting symbol
			const offset: number = sector % 2

			members.offset = offset
			onOffsetChanged(offset)
		})
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
		onSpinerStart() // In any case leads to onSymbolSelect call
		const dx: number = membersRef.current.deltaX

		// Just snap rotation of dx too small
		if ( Math.abs(dx) < DX_TRACEHOLD ) {
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
		const members: Members = membersRef.current
		members.rotation = ClampRotation(members.rotation)

		setRotation(-rotation) // Updating rotation state

		if ( finished ) AnimateSnapRotation()
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
			<View key='wdispc-evn' style={[style.container, style.containerH]}>
				<View key='wdisp-0' style={[style.display, style.displayBeg]}>
					<XSymbol/>
				</View>
				<View key='wdisp-2' style={[style.display, style.displayEnd]}>
					<XSymbol/>
				</View>
			</View>

			{/* Vertical wheel container with a symbols display */}
			<View key='wdispc-odd' style={[style.container, style.containerV]}>
				<View key='wdisp-1' style={[style.display, style.displayBeg]}>
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