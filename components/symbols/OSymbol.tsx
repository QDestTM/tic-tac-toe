import { Animated, StyleSheet, View } from "react-native";
import React from "react";


type Props = {
	appearValue?: number
}


function OSymbol({ appearValue = 1.0 }: Props)
{
	const scale: number = appearValue

	// Styles
	const mainStyle = {...style.main, transform : [{scale}] }

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<View style={style.body}/>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '100%',
		height: '100%',

		alignItems : 'center',
		justifyContent : 'center',
	},

	body : {
		width : '100%',
		aspectRatio : 1,

		position : 'absolute',
		backgroundColor : 'transparent',

		borderWidth: 10,
		borderRadius: '100%'
	}
})


export default OSymbol;