import React from 'react'
import { StyleSheet, TouchableOpacity, View, Image, Text, ImageBackground } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

const audioBookPlaylist = [
	{
		title: 'GO FOR IT',
		author: 'manago bran',
		source: 'spotify',
		uri:
			'https://ia601504.us.archive.org/9/items/midnight-studying.-lofi-jazzhop-chill-mix/midnight%20studying.%20%5Blofi%20_%20jazzhop%20_%20chill%20mix%5D.mp3',
		imageSource: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
	},

  	{
		title: 'JUST ONE MORE DAY',
		author: 'bro this is me',
		source: 'Librivox',
		uri:
			'https://archive.org/download/30-minutes-of-hindi-lofi-music-vol.-1-to-relax-study-sleep-think-sukoon/30%20minutes%20of%20hindi%20lofi%20music%20%F0%9F%92%9C%20Vol.1%20to%20relax_study_sleep_think_sukoon.mp3',
		imageSource: 'https://ia801706.us.archive.org/2/items/lp_the-old-beloved-songs_mormon-tabernacle-choir-richard-p-condie-a/lp_the-old-beloved-songs_mormon-tabernacle-choir-richard-p-condie-a_itemimage.png'
	},

  	{
		title: 'BOLLYWOOD MASHUP',
		author: 'BRUGHY:)',
		source: 'spotify',
		uri:
			'https://archive.org/download/1-a.-m-study-session-d-lofi-hip-hop-chill-beats/1%20A.M%20Study%20Session%20%C3%B0%C2%9F%C2%93%C2%9A%20-%20%5Blofi%20hip%20hop_chill%20beats%5D.mp3',
		imageSource: 'https://archive.org/services/img/opensource_audio?fallback=1?cnt=0'
	},
]



export default class App extends React.Component {
	state = {
		isPlaying: false,
		playbackInstance: null,
		currentIndex: 0,
		volume: 1.0,
		isBuffering: true
	}

	async componentDidMount() {
		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
				playsInSilentModeIOS: true,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
				shouldDuckAndroid: true,
				staysActiveInBackground: true,
				playThroughEarpieceAndroid: true
			})

			this.loadAudio()
		} catch (e) {
			console.log(e)
		}
	}

	async loadAudio() {
		const { currentIndex, isPlaying, volume } = this.state

		try {
			const playbackInstance = new Audio.Sound()
			const source = {
				uri: audioBookPlaylist[currentIndex].uri
			}

			const status = {
				shouldPlay: isPlaying,
				volume: volume
			}

			playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
			await playbackInstance.loadAsync(source, status, false)
			this.setState({
				playbackInstance
			})
		} catch (e) {
			console.log(e)
		}
	}

	onPlaybackStatusUpdate = status => {
		this.setState({
			isBuffering: status.isBuffering
		})
	}

	handlePlayPause = async () => {
		const { isPlaying, playbackInstance } = this.state
		isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

		this.setState({
			isPlaying: !isPlaying
		})
	}

	handlePreviousTrack = async () => {
		let { playbackInstance, currentIndex } = this.state
		if (playbackInstance) {
			await playbackInstance.unloadAsync()
    
			currentIndex > audioBookPlaylist.length - 1 ? (currentIndex -= 1) : (currentIndex =0)
			this.setState({
				currentIndex
			})
			this.loadAudio()
		}
	}

	handleNextTrack = async () => {
		let { playbackInstance, currentIndex } = this.state
		if (playbackInstance) {
			await playbackInstance.unloadAsync()
			currentIndex < audioBookPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
			this.setState({
				currentIndex
			})
			this.loadAudio()
		}
	}

	renderFileInfo() {
		const { playbackInstance, currentIndex } = this.state
		return playbackInstance ? (
			<View style={styles.trackInfo}>
				<Text style={[styles.trackInfoText, styles.largeText]}>
					{audioBookPlaylist[currentIndex].title}
				</Text>
				<Text style={[styles.trackInfoText, styles.smallText]}>
					{audioBookPlaylist[currentIndex].author}
				</Text>
				<Text style={[styles.trackInfoText, styles.smallText]}>
					{audioBookPlaylist[currentIndex].source}
				</Text>
			</View>
		) : null
	}

	render() {
		return (
       

			<View style={styles.container}>
     
				<Image
					style={styles.albumCover}
				source={{ uri: 'https://archive.org/download/brooklynmuseum-o1555-lake-george/brooklynmuseum-o1555i000-76.56_reference_SL1.jpg' }}
				/>
				<View style={styles.controls}>
					<TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
						<Ionicons name='arrow-back' size={48} color='#444' />
					</TouchableOpacity>
					<TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
						{this.state.isPlaying ? (
							<Ionicons name='ios-pause' size={48} color='#444' />
						) : (
							<Ionicons name='ios-play-circle' size={48} color='#444' />
						)}
					</TouchableOpacity>
					<TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
						<Ionicons name='arrow-forward' size={48} color='#444' />
					</TouchableOpacity>
				</View>
				{this.renderFileInfo()}
        

			</View>

      
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#009aff',
		alignItems: 'center',
		justifyContent: 'center'
    },
	albumCover: {
		width: 250,
		height: 250
	},
	trackInfo: {
		padding: 40,
		backgroundColor: '#fff'
	},

	trackInfoText: {
		textAlign: 'center',
		flexWrap: 'wrap',
		color: '#550088'
	},
	largeText: {
		fontSize: 22
	},
	smallText: {
		fontSize: 16
	},
	control: {
		margin: 20
	},
	controls: {
		flexDirection: 'row'
	}
})