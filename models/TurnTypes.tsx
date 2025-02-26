// Full state of the turn
export type TurnState = {
	// sq-{i} : string,
	pattern   : string[],
	winner    : string
}

// State of the whole match
export type MatchState = {
	turns : TurnState[] // Array with all turns
	index : number, // Index of current turn
	count : number // Count of turns
}