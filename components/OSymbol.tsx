import { Animated, StyleSheet, View } from "react-native";
import React from "react";


type Props = {
	appearProgress: number
}


function OSymbol({ appearProgress }: Props)
{
	const mainStyle = {...style.main, transform : [{ scale : appearProgress }] }

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<View style={style.circle}/>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		alignItems : 'center',
		justifyContent : 'center',

		width : '70%',
		height: '70%'
	},

	circle : {
		position : 'absolute',
		backgroundColor : 'transparent',

		borderWidth: 10,
		borderRadius: 40,

		width : '100%',
		height : '100%'
	}
})


export default OSymbol;