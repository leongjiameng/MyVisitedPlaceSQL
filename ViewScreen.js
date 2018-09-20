import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { FloatingAction } from 'react-native-floating-action';


const actions = [{
  text: 'Edit',
  color: '#c80000',
  icon: require('./images/baseline_edit_white_18dp.png'),
  name: 'edit',
  position: 2
},{
  text: 'Delete',
  color: '#c80000',
  icon: require('./images/baseline_delete_white_18dp.png'),
  name: 'delete',
  position: 1
}];


let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class ViewScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('headerTitle')
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      placeId: this.props.navigation.getParam('id'),
      place: null,
    };

    this._query = this._query.bind(this);

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
            place: results.rows.item(0),
          })
        }
      })
    });
  }

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.place.name +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          this.db.transaction((tx) => {
            tx.executeSql('DELETE FROM places WHERE id = ?', [this.state.placeId])
          });

          this.props.navigation.getParam('refresh')();
          this.props.navigation.goBack();
        },
      },
    ], { cancelable: false });
  }

  openDb() {
      console.log('Database opened');
  }

  errorDb(err) {
      console.log('SQL Error: ' + err);
  }

  render() {
    let place = this.state.place;
    let theDate = new Date(place ?place.date:'');

    return (

      <View style={styles.container}>

        <ScrollView>
          <InputWithLabel style={styles.output}
            label={'Name'}
            value={place ? place.name : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'City'}
            value={place ? place.city : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Date'}
            value={theDate.toDateString()}
            orientation={'vertical'}
            editable={false}
          />

        </ScrollView>
        <FloatingAction
          actions={actions}
          color={'#a80000'}
          floatingIcon={(
            <Image
              source={require('./images/baseline_edit_white_18dp.png')}
            />
          )}
          onPressItem={(name) => {
              switch(name) {
                case 'edit':
                  this.props.navigation.navigate('Edit', {
                    id: place ? place.id : 0,
                    headerTitle: place ? place.name : '',
                    refresh: this._query,
                    homeRefresh: this.props.navigation.getParam('refresh'),
                  });
                  break;

                case 'delete':
                  this._delete();
                  break;
              }
            }
          }
        />
      </View>
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
