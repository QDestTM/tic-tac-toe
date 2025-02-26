import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useRef, useState, useEffect } from 'react';
import React, { MutableRefObject } from 'react';

import { D, N, O, X } from '../Shared'

import XSymbol from './symbols/XSymbol';
import OSymbol from './symbols/OSymbol';
import DSymbol from './symbols/DSymbol';
import NSymbol from './symbols/NSymbol';


type Props = {
	hiddenSymbols?: string[],
	symbol?: string
}


function SymbolDisplay({ symbol = N, hiddenSymbols = [] }: Props)
{
	const appearValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( appearValueRef.current === null ) {
		appearValueRef.current = new Animated.Value(0)
	}

	// States
	const [ displaySymbol, setDisplaySymbol ] = useState(D)
	const [ appear, setAppear ] = useState(0)

	// Hooks
	useEffect(() => {
		const appearValue: Animated.Value = appearValueRef.current
		
		const listener = appearValue.addListener(({value}) => {
			setAppear(value)
		})

		// Return dismount callback
		return () => {
			appearValue.removeListener(listener)
		}
	})


	useEffect(() => {
		const animation = Animated.timing( // Hide animation
			appearValueRef.current,
			{
				toValue : 0,
				duration : appear == 0 ? 0 : 1000,
				easing : Easing.out(Easing.quad),
				useNativeDriver : false
			}
		)

		// Starting animation and handling finish
		animation.start(({ finished }) =>
		{
			const includes: boolean = hiddenSymbols.includes(symbol)

			if ( finished && !includes ) // Show animation
			{
				const animation = Animated.timing(
					appearValueRef.current,
					{
						toValue : 1,
						easing : Easing.bounce,
						duration : 1000,
						useNativeDriver : false
					}
				)

				setDisplaySymbol(symbol)
				animation.start()
			}
		})
	},
		[symbol]
	)

	// Functions
	function GetSymbolComponent()
	{
		switch (displaySymbol)
		{
			case X:
				return <XSymbol appearValue={appear}/>
			case O:
				return <OSymbol appearValue={appear}/>
			case D:
				return <DSymbol appearValue={appear}/>
			case N:
				return <NSymbol appearValue={appear}/>
			default:
				return <></>
		}
	}

	// Rendering JSX component
	return (
		<View style={style.main}>
			{ GetSymbolComponent() }
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		alignItems : 'center',
		justifyContent : 'center',

		width : '70%',
		height: '70%'
	},
})


export default SymbolDisplay;