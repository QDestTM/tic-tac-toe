
// Square key formatter
export function sq(index: number): string
{
	return `sq-${index}`
}

// Symbol getter
export function sym(index: number): string
{
	// Even index - X, Odd index - O
	return index % 2 ? O : X
}

// Linear interpolation function
export function lerp(a: number, b: number, x: number): number
{
	return a + (b - a) * x
}

// Symbols constants
export const X: string = 'x'
export const O: string = 'o'
export const N: string = 'n'
export const D: string = '-'

// Turn indexes
export const MinTurn: number = 4
export const MaxTurn: number = 8

export const StateRange: number[]
	= Array.from({ length : MaxTurn + 2 }, (_, i) => i)

// Color constants
export const COLOR_APP: string = 'powderblue'

export const COLOR_PRIMARY_0: string = 'lightseagreen'
export const COLOR_PRIMARY_1: string = 'teal'

export const COLOR_SECONDARY_0: string = 'linen'
export const COLOR_SECONDARY_1: string = 'wheat'
export const COLOR_SECONDARY_2: string = 'burlywood'
export const COLOR_SECONDARY_3: string = 'bisque'


// Pattern constant
export const WinningPatterns = [
	[sq(0), sq(1), sq(2)], // Horizontal lines
	[sq(3), sq(4), sq(5)],
	[sq(6), sq(7), sq(8)],
	[sq(0), sq(3), sq(6)], // Vertical lines
	[sq(1), sq(4), sq(7)],
	[sq(2), sq(5), sq(8)],
	[sq(0), sq(4), sq(8)], // Diagonal lines
	[sq(2), sq(4), sq(6)]
]