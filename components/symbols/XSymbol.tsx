import { Animated, StyleSheet, View } from "react-native";
import React from "react";

type Props = {
	appearValue?: number
}


function XSymbol({ appearValue = 1.0 }: Props)
{
	const rotate: number = 45 * appearValue

	// Styles
	const mainStyle = {...style.main,
		transform : [{ scaleY : appearValue }] }

	const box0 = { transform : [{ rotateZ : `+${rotate}deg` }] }
	const box1 = { transform : [{ rotateZ : `-${rotate}deg` }] }

	// Rendering JSX component
	return (
		<View style={mainStyle}>
			<Animated.View style={[style.box, box0]}/>
			<Animated.View style={[style.box, box1]}/>
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		alignItems : 'center',
		justifyContent : 'center',

		width : '100%',
		height: '100%'
	},

	box : {
		width : '15%',
		height : '100%',

		position : 'absolute',
		backgroundColor : 'black'
	}
})


export default XSymbol;