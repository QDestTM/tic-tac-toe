import { Animated, LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from "react-native";
import React, { MutableRefObject } from "react";
import { useRef, useState } from "react";


type Props = {
	appearValue?: number
}


function OSymbol({ appearValue = 1.0 }: Props)
{
	// States
	const [ borderWidth, setBorderWidth ] = useState(10)

	// Handlers
	function HandleLayout(event: LayoutChangeEvent)
	{
		const layout: LayoutRectangle = event.nativeEvent.layout
		setBorderWidth(layout.width * 0.15)
	}

	// Styles
	const mainStyle = {...style.main,
		transform   : [{scale : appearValue}]
	}
	const bodyStyle = {...style.body,
		borderWidth : borderWidth
	}

	// Rendering JSX component
	return (
		<Animated.View style={mainStyle}>
			<View
				onLayout={HandleLayout}
				style={bodyStyle}
			/>
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

		// borderWidth: 10,
		borderRadius: '100%'
	}
})


export default OSymbol;