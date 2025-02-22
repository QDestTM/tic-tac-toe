import { GestureResponderEvent, NativeTouchEvent } from 'react-native'
import { StyleSheet, View, Easing, Animated } from 'react-native'

import React, { useState, useRef, useEffect } from 'react'
import { MutableRefObject } from 'react'

import XSymbol from './XSymbol'
import OSymbol from './OSymbol'


function SymbolWheel()
{
	const rotationValueRef: MutableRefObject<Animated.Value> = useRef(null)
	const lastXRef: MutableRefObject<number> = useRef(null)

	// Initializing refs
	if ( rotationValueRef.current === null ) {
		rotationValueRef.current = new Animated.Value(0)
	}

	if ( lastXRef.current === null ) {
		lastXRef.current = 0
	}

	// States
	const [ rotation, setRotation ] = useState(0)

	// Hooks
	useEffect(() => {
		const animation = rotationValueRef.current
		const listener = animation.addListener(({value}) => {
			setRotation(value)
		})

		return () => {
			animation.removeListener(listener)
		}
	})

	// Handlers
	function HandleTouchStart(event: GestureResponderEvent)
	{
		rotationValueRef.current.stopAnimation()

		const move: NativeTouchEvent = event.nativeEvent
		lastXRef.current = move.pageX
	}

	function HandleTouchMove(event: GestureResponderEvent)
	{
		const move: NativeTouchEvent = event.nativeEvent
		const lastX: number = lastXRef.current

		// Applying rotation
		let dx: number = (move.pageX - lastX) / 2
		let rt: number = rotation + dx

		if ( rt < -360 ) {
			rt += 360
		} else
		if ( rt > 360 ) {
			rt -= 720
		}

		lastXRef.current = move.pageX
		setRotation(rt)
	}

	function HandleTouchEnd(event: GestureResponderEvent)
	{
		const toValue: number = Math.round(rotation / 90) * 90
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

	// Styles
	const mainStyle = {...style.main,
		transform : [{rotate: `${rotation}deg`}]
	}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}
			onTouchStart={HandleTouchStart}
			onTouchMove={HandleTouchMove}
			onTouchEnd={HandleTouchEnd}
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