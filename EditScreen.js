import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI'


let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class EditScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit: ' + navigation.getParam('headerTitle')
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      placeId: this.props.navigation.getParam('id'),
      name: '',
      city: '',
      date: '',
    };

    this._query = this._query.bind(this);
    this._update = this._update.bind(this);

    this.db = SQLite.openDatabase({name: 'placedb', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
  }

  componentDidMount() {
    this._query();
  }

  _query() {
    this.db.transaction((tx) => {
      tx.executeSql('SELECT * FROM places WHERE id = ?', [this.state.placeId], (tx, results) => {
        if(results.rows.length) {
          this.setState({
            name: results.rows.item(0).name,
            city: results.rows.item(0).city,
            date: results.rows.item(0).date,
          })
        }
      })
    });
  }

  _update() {
    this.db.transaction((tx) => {
      tx.executeSql('UPDATE places SET name=?,city=?,date=? WHERE id=?', [
        this.state.name,
        this.state.city,
        this.state.date,
        this.state.placeId,
      ]);
    });

    this.props.navigation.getParam('refresh')();
    this.props.navigation.getParam('homeRefresh')();
    this.props.navigation.goBack();
  }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
    let place = this.state.place;

    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={place? place.name:''}
          onChangeText={(name) => {this.setState({name})}}
          orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
          label={'City'}
          value={place? place.city:''}
          onChangeText={(city) => {this.setState({city})}}
          orientation={'vertical'}
        />

        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
