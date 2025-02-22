
// Square key formatter
export function sq(index: number): string
{
	return `sq-${index}`
}

// Container key formatter
export function cn(index: number): string
{
	return `cn-${index}`
}


// Symbols constants
export const X: string = 'x'
export const O: string = 'o'
export const N: string = 'n'
export const D: string = '-'

// Turn indexes
export const MinTurn: number = 4
export const MaxTurn: number = 8


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