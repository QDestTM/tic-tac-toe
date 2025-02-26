import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { MutableRefObject, StrictMode } from 'react';
import { useRef, useState } from 'react';

import { MatchState, TurnState } from './models/TurnTypes';

import { WinningPatterns, MinTurn, MaxTurn } from './Shared'
import { D, N, sym, sq } from './Shared'
import { COLOR_APP } from './Shared'

import SymbolWheel from './components/SymbolWheel';
import TurnsMenu from './components/TurnsMenu';
import GridBox from './components/GridBox';


// Functions
function GenerateState(): MatchState
{
	const state: MatchState = {
		turns : [{
			pattern : [],
			winner  : N
		}],

		index : 0,
		count : 0
	}

	// Grid generation
	const turn: TurnState = state.turns[0]

	for ( let i = 0; i <= MaxTurn; i++ )
	{
		turn[sq(i)] = D
	}

	return state
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
	var [ matchState, setMatchState ] = useState(GenerateState)

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
		const state: MatchState = matchState

		// Incrementing turn index
		const indexCurr: number = state.index
		const indexNext: number = state.index + 1

		// Updating turn state
		const offset: number = symbolOffsetRef.current
		const symbol: string = sym(turnIndex + offset)

		const stateCurr: TurnState = state.turns[indexCurr]
		const stateNext: TurnState = {...stateCurr, [key] : symbol}

		// Checking for winners
		const [winner, pattern] = FindWinner(stateNext, indexNext, symbol);

		stateNext.pattern = pattern
		stateNext.winner = winner

		// Updating turns array
		const turnsCurr: TurnState[] = state.turns
		const turnsNext: TurnState[] = [...turnsCurr.slice(0, indexNext), stateNext]

		// Updating match state
		setMatchState({
			turns : turnsNext,
			index : indexNext,
			count : turnsNext.length
		})
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
		setMatchState({...matchState, index})
	}

	// Properties
	const turnIndex: number = matchState.index
	const turnState: TurnState = matchState.turns[turnIndex]

	// Rendering JSX component
	return (
		<StrictMode>
			<View style={style.main}>

				<View style={style.container0}>
					<TurnsMenu
						matchState={matchState}
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