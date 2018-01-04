import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Util } from 'expo';

import Loader from 'react-native-mask-loader';

type State = {|
  appReady: boolean,
|};

export default class App extends React.Component<{}, State> {
  state = {
    appReady: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        appReady: true,
      });
    }, 2000);
  }

  render() {
    return (
      <Loader
        isLoaded={this.state.appReady}
        imageSource={require('./assets/twitter.png')}
        backgroundStyle={styles.loadingBackgroundStyle}
      >
        <View style={styles.container}>
          <Button onPress={() => {
            Util.reload();
          }} title="See it again">
          </Button>
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingBackgroundStyle: {
    backgroundColor: 'rgba(125, 125, 255, 1)',
  },
});
