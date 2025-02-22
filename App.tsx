import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { StrictMode, useState } from 'react';
import { TurnsData, TurnState } from './models/TurnTypes';

import { WinningPatterns, MinTurn, MaxTurn } from './Shared'
import { X, O, D, N, sq } from './Shared'

import GridBox from './components/GridBox';


// Functions
function GenerateTurnsData(): TurnsData
{
	const object: TurnState = { winner : N }

	for ( let i = 0; i < 9; i++ ) {
		object[sq(i)] = D
	}

	return [object]
}


function FindWinner(state: TurnState, turn: number, symbol: string): string
{
	const comparer = (key: string) => state[key] === symbol

	if ( state.winner !== N ) {
		return state.winner // Winner already found
	}

	if ( turn < MinTurn ) {
		return N // Can win only after 4 turns
	}

	// Searching for patterns
	for ( var pattern of WinningPatterns )
	{
		if ( pattern.every(comparer) ) {
			return symbol
		}
	}

	// Draw check
	if ( turn === MaxTurn ) {
		return D // Draw if no mathes on 8 turn
	}

	return N // No patterns mathed
}


// Main components
function App()
{
	// States
	var [ turnsData, setTurnsData ] = useState(GenerateTurnsData)
	var [ turnIndex, setTurnIndex ] = useState(0)
	var [ symbol, setSymbol ] = useState(X)

	// Handlers
	function HandleSquarePress(key: string): void
	{
		// Incrementing turn index
		const nextIndex: number = turnIndex + 1
		setTurnIndex(nextIndex)

		// Updating turns data state
		const lastState: TurnState = turnsData[turnsData.length - 1]
		const nextState: TurnState = {...lastState, [key] : symbol}

		setTurnsData([...turnsData, nextState])

		// Checking for winners
		const winner: string = FindWinner(nextState, nextIndex, symbol);
		nextState.winner = winner

		// Updating symbol state
		setSymbol( winner === N ? (symbol == X ? O : X) : D )
	}

	// Properties
	const turnState: TurnState = turnsData[turnIndex]

	// Rendering JSX component
	return (
		<StrictMode>
			<View style={style.main}>

				<View style={style.container0}>

				</View>

				<View style={style.container1}>
					<GridBox onSquarePress={HandleSquarePress} turnState={turnState}/>
				</View>

				<View style={style.container2}>

				</View>

				<StatusBar style="auto"/>
			</View>
		</StrictMode>
	);
}

const style = StyleSheet.create({
	main : {
		flex: 1,

		justifyContent: 'center',
		alignItems: 'stretch',

		backgroundColor: 'powderblue'
	},

	container0 : {
		flex : 2
	},

	container1 : {
		flex : 2
	},

	container2 : {
		flex : 1
	}
});


export default App;