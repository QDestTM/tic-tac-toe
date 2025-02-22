import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useRef, useState, useEffect } from 'react';
import React, { MutableRefObject } from 'react';

import XSymbol from './XSymbol';
import OSymbol from './OSymbol';

import { X } from '../Shared'


type Props = {
	symbol: string
}


function SymbolContainer({ symbol }: Props)
{
	const appearValueRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( appearValueRef.current === null ) {
		appearValueRef.current = new Animated.Value(0)
	}

	// States
	const [ appear, setAppear ] = useState(0)

	// Hooks
	useEffect(() => {
		const appearValue: Animated.Value = appearValueRef.current
		
		const listener = appearValue.addListener(({value}) => {
			setAppear(value)
		})

		// Starting appear animation
		const animation = Animated.timing(
			appearValue,
			{
				toValue : 1,
				duration : 1000,
				easing : Easing.bounce,
				useNativeDriver : false
			}
		)

		animation.start()

		// Return dismount callback
		return () => {
			appearValue.removeListener(listener)
		}
	},
		[appearValueRef]
	)

	// Rendering JSX component
	return (
		<View style={style.main}>
			{ symbol == X ?
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


export default SymbolContainer;