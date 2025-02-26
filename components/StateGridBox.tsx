import { View, StyleSheet } from 'react-native'
import React from 'react'

import { TurnState } from '../models/TurnTypes'
import SymbolDisplay from './SymbolDisplay'

import { COLOR_SECONDARY_0 } from '../Shared'
import { COLOR_SECONDARY_2 } from '../Shared'
import { COLOR_PRIMARY_0 } from '../Shared'
import { COLOR_PRIMARY_1 } from '../Shared'
import { GridRange } from '../Shared'
import { D, sq } from '../Shared'

type Props = {
	turnState : TurnState,
}


function StateGridBox({ turnState }: Props)
{
	// Functions
	function SquareRender(index: number)
	{
		const skey: string = sq(index)

		return (
			<View style={styles.container}>
				<SymbolDisplay
					hiddenSymbols={[D]}
					symbol={turnState[skey]}
				/>
			</View>
		)
	}

	// Rendering JSX component
	return (
		<View style={styles.main}>
			{ GridRange.map(SquareRender) }
		</View>
	)
}


const styles = StyleSheet.create({
	main : {
		aspectRatio : 1,

		flexDirection : 'row',
		flexWrap : 'wrap',

		justifyContent: 'center',
		alignItems: 'stretch',

		marginHorizontal : '20%',
		padding: 5,

		borderColor: COLOR_PRIMARY_1,
		borderWidth: 3,
		borderRadius: 6,

		backgroundColor : COLOR_PRIMARY_0,
	},

	container : {
		width : '27%',
		height : '27%',

		margin : '3%',

		alignItems : 'center',
		justifyContent : 'center',

		borderWidth : 2,
		borderRadius : '10%',
		borderColor : COLOR_SECONDARY_2,

		backgroundColor : COLOR_SECONDARY_0
	}
})


export default StateGridBox;