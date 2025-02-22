import { StyleSheet, View } from 'react-native'
import React from 'react'


type Props = {
	appearValue?: number
}


function XSymbol({ appearValue = 1.0 }: Props)
{
	const scaleX: number = appearValue
	const rotate: number = 45 * appearValue

	// Styles
	const mainStyle = {...style.main, transform : [{scaleX}] }

	const box0 = { transform : [{ rotateZ : `+${rotate}deg` }] }
	const box1 = { transform : [{ rotateZ : `-${rotate}deg` }] }

	// Rendering JSX component
	return (
		<View style={mainStyle}>
			<View style={[style.box, box0]}/>
			<View style={[style.box, box1]}/>
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
		position : 'absolute',
		backgroundColor : 'black',

		width : '100%',
		height : '15%'
	}
})


export default XSymbol;