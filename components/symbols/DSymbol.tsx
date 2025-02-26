import { Animated, StyleSheet, View } from "react-native";
import React from "react";


type Props = {
	appearValue?: number
}

function DSymbol({ appearValue = 1.0 }: Props)
{
	const mainStyle = {...style.main,
		transform : [{scaleX : appearValue}]}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<View style={style.line}/>
		</Animated.View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '100%',
		aspectRatio : 1,

		alignItems : 'center',
		justifyContent : 'center',
	},

	line : {
		width : '100%',
		height : '15%',

		borderRadius : '20%',

		position : 'absolute',
		backgroundColor : 'black',
	}
})


export default DSymbol;