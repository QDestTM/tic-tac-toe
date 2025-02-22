import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useRef, useState, useEffect } from 'react';
import { MutableRefObject } from 'react';
import React from 'react';

import XSymbol from './XSymbol';
import OSymbol from './OSymbol';

import { X } from '../Shared'


type Props = {
	symbol: string
}


function SymbolContainer({ symbol }: Props)
{
	const appearAnimationRef: MutableRefObject<Animated.Value> = useRef(null)

	// Initializing refs
	if ( appearAnimationRef.current === null ) {
		appearAnimationRef.current = new Animated.Value(0)
	}

	// States
	const [ appearProgress, setAppearProgress ] = useState(0)

	// Hooks
	useEffect(() => {
		const appearAnimation: Animated.Value = appearAnimationRef.current
		
		const listener = appearAnimation.addListener(({value}) => {
			setAppearProgress(value)
		})

		// Starting appear animation
		const animation = Animated.timing(
			appearAnimationRef.current,
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
			appearAnimation.removeListener(listener)
		}
	},
		[appearAnimationRef]
	)

	// Rendering JSX component
	return (
		<View style={style.main}>
			{ symbol == X ?
				<XSymbol appearProgress={appearProgress}/> :
				<OSymbol appearProgress={appearProgress}/>
			}
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		alignItems : 'center',
		justifyContent : 'center',

		width : '100%',
		height: '100%'
	},
})


export default SymbolContainer;