import { View, Animated, StyleSheet } from "react-native"

import { useState, useEffect, useRef } from "react"
import { MutableRefObject } from "react"
import { ReactNode } from "react"


type Props = {
	children?: ReactNode,

	ignoreTouch?: boolean,
	touchDuration: number,

	touchEasing: (value: number) => number,
	onTouchAnimation: (value: number) => void
	onTouchInput: () => void
}


function TransitionButton({
	children, touchDuration, ignoreTouch = false,
	touchEasing, onTouchAnimation, onTouchInput }: Props)
{
	const touchValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( touchValueRef.current === null ) {
		touchValueRef.current = new Animated.Value(0)
	}

	// States
	const [ touched, setTouched ] = useState(false)

	// Hooks
	useEffect(() => {
		const touchValue: Animated.Value = touchValueRef.current

		const touchListener = touchValue.addListener(({value}) => {
			onTouchAnimation(value)
		})

		// Returning dismount callback
		return () => {
			touchValue.removeListener(touchListener)
		}
	})


	useEffect(() => {
		const touchValue: Animated.Value = touchValueRef.current

		if ( touched ) // Press IN
		{
			touchValue.setValue(1)
		}
		else // Press OUT
		{
			const animation = Animated.timing(
				touchValue, {
					toValue : 0,
					duration : touchDuration,
					easing : touchEasing,
					useNativeDriver : false
				}
			)

			animation.start()
		}
	},
		[touched]
	)

	// Handlers
	function HandleTouchStart()
	{
		setTouched(true)
	}


	function HandleTouchEnd()
	{
		setTouched(false); onTouchInput()
	}

	// Rendering JSX component
	return (
		<View
			style={style.main}
			onTouchStart={!ignoreTouch && HandleTouchStart}
			onTouchEnd={!ignoreTouch && HandleTouchEnd}
		>
			{children}
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '100%',
		height : '100%'
	}
})


export default TransitionButton;