import { View, StyleSheet, Animated, Easing } from 'react-native'
import React, { useState, useRef, useEffect } from 'react';

import { SquarePressCallback } from '../models/BaseTypes'

import { MutableRefObject } from 'react'
import { ReactNode } from 'react'

const BORDER_RADIUS_MIN = 10
const BORDER_RADIUS_MAX = 20


interface Props
{
	skey: string,
	onSquarePress: SquarePressCallback,

	children?: ReactNode
}


function Square({ skey, children, onSquarePress }: Props)
{
	const pressProgress: MutableRefObject<Animated.Value> = useRef(null);

	// Initializing refs
	if ( pressProgress.current === null ) {
		pressProgress.current = new Animated.Value(0)
	}

	// States
	const [ backgroundColor, setBackgroundColor ] = useState('linen')
	const [ borderRadius, setBorderRadius ] = useState(BORDER_RADIUS_MIN)

	// Hooks
	useEffect(() => {
		const animation: Animated.Value = pressProgress.current

		const animationListener = animation.addListener(() => {
			const inputRange: number[] = [0, 1]

			// Background color
			let color = animation.interpolate<string>({
				inputRange, outputRange : ['linen', 'wheat']
			})

			setBackgroundColor(color as unknown as string)

			// Border radius
			let radius = animation.interpolate<number>({
				inputRange, outputRange : [BORDER_RADIUS_MIN, BORDER_RADIUS_MAX]
			})

			setBorderRadius(radius as unknown as number)
		})

		return () => {
			animation.removeListener(animationListener)
		}
	},
		[pressProgress]
	)

	// Handlers
	function HandlePressIn()
	{
		pressProgress.current.setValue(1)
	}

	function HandlePressOut()
	{
		const animation = Animated.timing(
			pressProgress.current,
			{
				toValue : 0,
				duration : 1000,
				easing : Easing.bounce,
				useNativeDriver : false
			}
		)

		animation.start()
		onSquarePress(skey)
	}

	// Rendering calculations
	const squareStyle = {...style.box, borderRadius, backgroundColor}

	var handlePressStart = () => {};
	var handlePressEnd = () => {};

	if ( children === null )
	{
		handlePressStart = HandlePressIn
		handlePressEnd = HandlePressOut
	}

	return (
		<View style={style.main}>
			<Animated.View
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
				style={squareStyle}
			>
				{children}
			</Animated.View>
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		width : 100,
		height : 100
	},

	box : {
		alignItems : 'center',
		justifyContent : 'center',

		borderRadius : 5,
		borderWidth : 6,
		borderStyle : 'solid',
		borderColor : 'burlywood',

		margin : 5,
		flex : 1
	}
})

export default Square;