import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { MutableRefObject, StrictMode } from 'react';
import { useRef, useState } from 'react';

import { MatchState, TurnState } from './models/TurnTypes';

import { WinningPatterns, MinTurn, MaxTurn } from './Shared'
import { D, N, sym, sq } from './Shared'
import { MatchContext } from './Context';
import { COLOR_APP } from './Shared'

import SymbolWheel from './components/SymbolWheel';
import TurnsMenu from './components/TurnsMenu';
import GridBox from './components/GridBox';


// Functions
function CreateMatchState(): MatchState
{
	const state: MatchState = {
		turns : [{
			pattern : [],
			winner  : N
		}],

		index : 0,
		count : 0,

		offsetValue : 0,
		offsetStore : -1
	}

	// Grid generation
	const turn: TurnState = state.turns[0]

	for ( let i = 0; i <= MaxTurn; i++ )
	{
		turn[sq(i)] = D
	}

	return state
}


function CheckWinner(
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
	// States
	var [ blockingInput, setBlockingInput ] = useState(false)
	var [ matchState, setMatchState ] = useState(CreateMatchState)

	// Functions
	function GetInputBlocker()
	{
		if ( !blockingInput ) return null

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
		const symbol : string = sym(turnIndex + state.offsetValue)

		const stateCurr: TurnState = state.turns[indexCurr]
		const stateNext: TurnState = {...stateCurr, [key] : symbol}

		// Checking for winners
		const [winner, pattern] = CheckWinner(stateNext, indexNext, symbol);

		stateNext.pattern = pattern
		stateNext.winner = winner

		// Updating turns array
		const turnsCurr: TurnState[] = state.turns
		const turnsNext: TurnState[] = [...turnsCurr.slice(0, indexNext), stateNext]

		// Updating match state
		setMatchState({
			turns  : turnsNext,
			index  : indexNext,
			count  : turnsNext.length,

			offsetValue : state.offsetValue,
			offsetStore : state.offsetStore
		})
	}


	function HandleSpinerStart()
	{
		setBlockingInput(true)
	}


	function HandleOffsetChanged(offset: number)
	{
		setMatchState({...matchState, offsetValue : offset})
		setBlockingInput(false)
	}


	function HandleTouchInput(event: GestureResponderEvent)
	{
		event.stopPropagation()
	}


	function HandleTurnSelect(index: number)
	{
		var offsetValue: number = matchState.offsetValue
		var offsetStore: number = matchState.offsetStore

		// Checking and updating offsets
		if ( index === 0 ) {
			offsetStore = offsetValue
		} else
		if ( offsetStore !== -1 ) { // && index !== 0
			offsetValue = offsetStore; offsetStore = -1
		}

		// Updating match state
		setMatchState({...matchState, index, offsetStore, offsetValue})
	}

	// Properties
	const turnIndex : number    = matchState.index
	const turnState : TurnState = matchState.turns[turnIndex]

	// Rendering JSX component
	return (
		<StrictMode>
			<MatchContext.Provider value={matchState}>
				<View style={style.main}>

					{/* Container for TurnsMenu component */}
					<View style={style.container0}>
						<TurnsMenu
							onTurnSelect={HandleTurnSelect}
						/>

						{GetInputBlocker()}
					</View>

					{/* Container for GridBox component */}
					<View style={style.container1}>
						<GridBox
							onSquarePress={HandleSquarePress}
							turnState={turnState}
						/>

						{GetInputBlocker()}
					</View>

					{/* Container for SymbolWheel component */}
					<View style={style.container2}>
						<SymbolWheel
							onOffsetChanged={HandleOffsetChanged}
							onSpinerStart={HandleSpinerStart}
						/>
					</View>

					{/* StatusBar component */}
					<StatusBar style="auto"/>
				</View>
			</MatchContext.Provider>
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