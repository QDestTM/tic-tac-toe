import { StyleSheet, View } from 'react-native'
import React from 'react'


type Props = {
	appearProgress: number
}


function XSymbol({ appearProgress }: Props)
{
	const mainStyle = {...style.main, transform : [{ scaleX : appearProgress }] }

	const styleNor = { transform : [{ rotateZ : `+${45 * appearProgress}deg` }] }
	const styleInv = { transform : [{ rotateZ : `-${45 * appearProgress}deg` }] }

	// Rendering JSX component
	return (
		<View style={mainStyle}>
			<View style={[style.line, styleNor]}/>
			<View style={[style.line, styleInv]}/>
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		alignItems : 'center',
		justifyContent : 'center',

		width : '70%',
		height: '70%'
	},

	line : {
		position : 'absolute',
		backgroundColor : 'black',

		width : '100%',
		height : '15%'
	}
})


export default XSymbol;