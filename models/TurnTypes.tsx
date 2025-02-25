// Full state of the turn
export type TurnState = {
	pattern : string[],
	winner : string
}

// Array with all states
export type TurnsData = TurnState[]