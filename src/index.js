/* @flow */

import * as React from 'react';
import {
  Animated,
  StatusBar,
  View,
  StyleSheet,
  MaskedViewIOS,
} from 'react-native';

type Props = {|
  +children: React.Node,
  +isLoaded: boolean,
  +imageSource: any,
  +backgroundStyle: any,
|};

type State = {|
  loadingProgress: Animated.Value,
  animationDone: boolean,
|};

export default class Loader extends React.Component<Props, State> {
  static defaultProps = {
    isLoaded: false,
  };

  state = {
    loadingProgress: new Animated.Value(0),
    animationDone: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isLoaded && !this.props.isLoaded) {
      Animated.timing(this.state.loadingProgress, {
        toValue: 100,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        this.setState({
          animationDone: true,
        });
      });
    }
  }

  render() {
    const opacityClearToVisible = {
      opacity: this.state.loadingProgress.interpolate({
        inputRange: [0, 15, 30],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    };

    const imageScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
            inputRange: [0, 10, 100],
            outputRange: [1, 0.8, 70],
          }),
        },
      ],
    };

    const appScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
            inputRange: [0, 7, 100],
            outputRange: [1.1, 1.03, 1],
          }),
        },
      ],
    };

    const fullScreenBackgroundLayer = this.state.animationDone ? null : (
      <View style={[StyleSheet.absoluteFill, this.props.backgroundStyle]} />
    );
    const fullScreenWhiteLayer = this.state.animationDone ? null : (
      <View style={[StyleSheet.absoluteFill, styles.fullScreenWhiteLayer]} />
    );

    return (
      <View style={styles.fullScreen}>
        <StatusBar animated={true} hidden={!this.state.animationDone} />
        {fullScreenBackgroundLayer}
        <MaskedViewIOS
          style={{ flex: 1 }}
          maskElement={
            <View style={styles.centeredFullScreen}>
              <Animated.Image
                style={[styles.maskImageStyle, imageScale]}
                source={this.props.imageSource}
              />
            </View>
          }
        >
          {fullScreenWhiteLayer}
          <Animated.View style={[opacityClearToVisible, appScale, { flex: 1 }]}>
            {this.props.children}
          </Animated.View>
        </MaskedViewIOS>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  centeredFullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskImageStyle: {
    height: 100,
    width: 100,
  },
  fullScreenWhiteLayer: {
    backgroundColor: 'white',
  },
});
