import { StatusBar } from 'expo-status-bar';

import { StyleSheet, View } from 'react-native';
import { StrictMode, useState } from 'react';

import GridBox from './components/GridBox';
import { X, O } from './Constants'


function App()
{
	var [ turnIndex, setTurnIndex ] = useState(0)
	var [ history, setHistory ] = useState([{}])
	var [ symbol, setSymbol ] = useState(X)

	function NextTurn(square)
	{
		const nextIndex = turnIndex + 1
		setTurnIndex(nextIndex)

		history[nextIndex] = {...history[turnIndex], [square] : symbol}
		setHistory(history)

		setSymbol(symbol == X ? O : X)
	}

	return (
		<StrictMode>
			<View style={styles.main}>
				<GridBox
					onSquarePress={NextTurn}
					turnData={history[turnIndex]}
				/>
				<StatusBar style="auto"/>
			</View>
		</StrictMode>
	);
}

const styles = StyleSheet.create({
	main : {
		backgroundColor: 'powderblue',
		justifyContent: 'center',
		alignItems: 'center',

		flex: 1
	}
});

export default App;