import { View, StyleSheet } from 'react-native'
import React from 'react'

import { SquarePressCallback } from '../models/BaseTypes'
import { TurnState } from '../models/TurnTypes'

import SymbolContainer from './SymbolContainer'
import { D, N, sq, cn } from '../Shared'
import Square from './Square'



interface Props
{
	onSquarePress: SquarePressCallback,
	turnState : TurnState
}


function GridBox({ onSquarePress, turnState }: Props)
{
	const handlePress: boolean = turnState.winner === N
	const range: number[] = [0, 1, 2]

	// Functions
	function GridGenerator(row: number)
	{
		return (
			range.map((i) => SquareRender(row * range.length, i))
		)
	}

	function SquareRender(row: number, index: number)
	{
		let skey: string = sq(row + index)
		let ckey: string = cn(row + index)

		let symbol: string = turnState[skey]

		return (
			<Square
				key={skey} skey={skey}
				handlePress={handlePress}
				onSquarePress={onSquarePress}>
			{
				symbol !== D
					? <SymbolContainer key={ckey} symbol={symbol}/>
					: null
			}
			</Square>
		)
	}

	// Rendering JSX component
	return (
		<View style={styles.main}>
			{ range.map(GridGenerator) }
		</View>
	)
}


const styles = StyleSheet.create({
	main : {
		backgroundColor : 'lightseagreen',

		aspectRatio : 1,
		flexWrap : 'wrap',

		justifyContent: 'center',
		alignItems: 'stretch',

		marginLeft: '6%',
		marginRight: '6%',

		borderColor: 'teal',
		borderWidth: 10,

		borderRadius: 6,
		padding: 8
	}
})

export default GridBox;