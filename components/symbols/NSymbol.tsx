import { Animated, StyleSheet, View } from "react-native";
import React from "react";


type Props = {
	appearValue?: number
}

function NSymbol({ appearValue = 1.0 }: Props)
{
	const mainStyle = {...style.main,
		transform : [{scale : appearValue}]}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<View style={style.dot}/>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '30%',
		aspectRatio : 1,

		alignItems : 'center',
		justifyContent : 'center',
	},

	dot : {
		width : '100%',
		height : '100%',

		borderRadius : '100%',

		position : 'absolute',
		backgroundColor : 'black',
	}
})


export default NSymbol;