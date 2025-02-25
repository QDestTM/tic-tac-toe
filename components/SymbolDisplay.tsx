import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useRef, useState, useEffect } from 'react';
import React, { MutableRefObject } from 'react';

import XSymbol from './XSymbol';
import OSymbol from './OSymbol';

import { D, X } from '../Shared'


type Props = {
	symbol: string
}


function SymbolDisplay({ symbol }: Props)
{
	const appearValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( appearValueRef.current === null ) {
		appearValueRef.current = new Animated.Value(0)
	}

	// States
	const [ renderSymbol, setRenderSymbol ] = useState(D)
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
		let easing = Easing.bounce
		let toValue: number = 1

		if ( symbol !== D ) {
			setRenderSymbol(symbol)
		} else { // Dissapear
			easing = Easing.out(Easing.quad)
			toValue = 0
		}

		const animation = Animated.timing(
			appearValueRef.current,
			{
				toValue, easing,
				duration : 1000,
				useNativeDriver : false
			}
		)

		animation.start()
	},
		[symbol]
	)

	// Rendering JSX component
	return (
		<View style={style.main}>
			{ renderSymbol == X ?
				<XSymbol appearValue={appear}/> :
				<OSymbol appearValue={appear}/>
			}
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