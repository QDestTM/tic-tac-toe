import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { MutableRefObject, StrictMode, useRef, useState } from 'react';
import { TurnsData, TurnState } from './models/TurnTypes';

import { WinningPatterns, MinTurn, MaxTurn } from './Shared'
import { D, N, sym, sq } from './Shared'
import { COLOR_APP } from './Shared'

import SymbolWheel from './components/SymbolWheel';
import TurnsMenu from './components/TurnsMenu';
import GridBox from './components/GridBox';


// Functions
function GenerateTurnsData(): TurnsData
{
	const state: TurnState = {
		pattern : [], winner : N
	}

	// Grid generation
	for ( let i = 0; i < 9; i++ ) {
		state[sq(i)] = D
	}

	return [state]
}


function FindWinner(
	state: TurnState, turn: number, symbol: string): [string, string[]]
{
	const comparer = (key: string) => state[key] === symbol

	if ( state.winner !== N ) {
		return [state.winner, []] // Winner already found
	}

	if ( turn < MinTurn ) {
		return [N, []] // Can win only after 4 turns
	}

	// Searching for patterns
	for ( var pattern of WinningPatterns )
	{
		if ( pattern.every(comparer) ) {
			return [symbol, pattern]
		}
	}

	// Draw check
	if ( turn > MaxTurn ) {
		return [D, []] // Draw if no mathes on 8 turn
	}

	return [N, []] // No patterns mathed
}


// Main components
function App()
{
	const symbolOffsetRef: MutableRefObject<number> = useRef(null)

	// Initializing refs
	if ( symbolOffsetRef.current === null ) {
		symbolOffsetRef.current = 0
	}

	// States
	var [ blockingInput, setBlockingInput ] = useState(false)

	var [ turnsData, setTurnsData ] = useState(GenerateTurnsData)
	var [ turnIndex, setTurnIndex ] = useState(0)

	// Functions
	function GetInputBlocker()
	{
		if ( !blockingInput )
		{
			return undefined
		}

		return (
			<View
				style={style.blocker}
				onTouchStart={HandleTouchInput}
				onTouchEnd={HandleTouchInput}
			/>
		)
	}


	// Handlers
	function HandleSquarePress(key: string)
	{
		// Incrementing turn index
		const nextIndex: number = turnIndex + 1
		setTurnIndex(nextIndex)

		// Updating turns data state
		const offset: number = symbolOffsetRef.current
		const symbol: string = sym(turnIndex + offset)

		const lastState: TurnState = turnsData[turnIndex]
		const nextState: TurnState = {...lastState, [key] : symbol}

		setTurnsData([...turnsData.slice(0, nextIndex), nextState])

		// Checking for winners
		const [winner, pattern] = FindWinner(nextState, nextIndex, symbol);

		nextState.pattern = pattern
		nextState.winner = winner
	}


	function HandleSpinerStart()
	{
		setBlockingInput(true)
	}


	function HandleOffsetChanged(offset: number)
	{
		symbolOffsetRef.current = offset
		setBlockingInput(false)
	}


	function HandleTouchInput(event: GestureResponderEvent)
	{
		event.stopPropagation()
	}


	function HandleTurnSelect(index: number)
	{
		setTurnIndex(index)
	}

	// Properties
	const turnState: TurnState = turnsData[turnIndex]

	// Rendering JSX component
	return (
		<StrictMode>
			<View style={style.main}>

				<View style={style.container0}>
					<TurnsMenu
						turnsData={turnsData}
						turnIndex={turnIndex}
						onTurnSelect={HandleTurnSelect}
					/>

					{GetInputBlocker()}
				</View>

				<View style={style.container1}>
					<GridBox
						onSquarePress={HandleSquarePress}
						turnState={turnState}
					/>

					{GetInputBlocker()}
				</View>

				<View style={style.container2}>
					<SymbolWheel
						onOffsetChanged={HandleOffsetChanged}
						onSpinerStart={HandleSpinerStart}
						turnIndex={turnIndex}
					/>
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

		backgroundColor: COLOR_APP
	},

	// Containers
	container0 : {
		flex : 2
	},

	container1 : {
		flex : 2
	},

	container2 : {
		flex : 1,

		alignItems : 'center'
	},

	// Event blocker
	blocker : {
		width : '100%',
		height : '100%',

		position : 'absolute'
	}
});


export default App;