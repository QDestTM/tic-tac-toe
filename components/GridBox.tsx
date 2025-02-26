import { View, StyleSheet } from 'react-native'
import React from 'react'

import { SquareState } from '../models/BaseTypes'
import { TurnState } from '../models/TurnTypes'

import { GridRange, sq } from '../Shared'
import Square from './Square'



type Props = {
	turnState : TurnState,
	onSquarePress: (skey: string) => void
}


function GridBox({ onSquarePress, turnState }: Props)
{
	// Functions
	function SquareRender(index: number)
	{
		const skey: string = sq(index)

		const state: SquareState = {
			pattern : turnState.pattern,

			winner : turnState.winner,
			symbol : turnState[skey]
		}

		return (
			<Square
				key={skey} skey={skey} state={state}
				onTouchInput={onSquarePress}
			/>
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
		backgroundColor : 'lightseagreen',

		aspectRatio : 1,

		flexDirection : 'row',
		flexWrap : 'wrap',

		justifyContent: 'center',
		alignItems: 'stretch',

		marginHorizontal : '6%',

		borderColor: 'teal',
		borderWidth: 10,

		borderRadius: 6,
		padding: 8
	}
})

export default GridBox;