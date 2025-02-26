import { ScrollView, StyleSheet, View } from "react-native"

import { TurnsData, TurnState } from "../models/TurnTypes"
import { StateRange } from "../Shared"

import TurnStateDisplay from "./TurnStateDisplay"
import { MutableRefObject, useEffect, useRef } from "react"


type Props = {
	turnsData: TurnsData,
	turnIndex: number,

	onTurnSelect: (index: number) => void
}


function TurnsMenu({ turnsData, turnIndex, onTurnSelect }: Props)
{
	const scrollViewRef: MutableRefObject<ScrollView> = useRef(null)

	// Hooks
	useEffect(() => {
		scrollViewRef.current.scrollTo({ x : 0, animated : true })
	},
		[turnsData.length]
	)

	// Functions
	function RenderDisplay(index: number)
	{
		const state: TurnState | undefined = turnsData[index]

		return (
			<View>
				<TurnStateDisplay key={`state-disp-${index}`}
					turnState={state} turnIndex={index}
					selected={index === turnIndex}
					onTurnSelect={onTurnSelect}
				/>
			</View>
		)
	}

	// Rendering JSX component
	return (
		<View style={style.main}>
			<ScrollView
				ref={scrollViewRef}
				horizontal={true}
				contentContainerStyle={style.scrollContainer}
				showsHorizontalScrollIndicator={false}
			>
				{ StateRange.map(RenderDisplay) }
			</ScrollView>
		</View>
	)
}


const style = StyleSheet.create({
	main : {
		width : '100%',
		height : '90%',

		paddingHorizontal : '3%',
		paddingVertical : '3%',

		alignItems : 'center',
		justifyContent : 'center',

		borderBottomRightRadius : 32,
		borderBottomLeftRadius : 32,
		borderColor : 'teal',

		borderBottomWidth : 10,
		borderLeftWidth : 1,
		borderRightWidth : 1,

		backgroundColor : 'lightseagreen'
	},

	// Scroll styles
	scrollContainer : {
		marginTop : '3%',

		flexDirection : 'row-reverse',
		paddingVertical : '4%'
	}
})


export default TurnsMenu;