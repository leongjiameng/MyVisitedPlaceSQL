import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  AppRegistry,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI';

import { DatePickerDialog } from 'react-native-datepicker-dialog'

import moment from 'moment';



let SQLite = require('react-native-sqlite-storage');

type Props = {};
export default class CreateScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Add Place',
  };

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      city: '',
      date: '',
      DateText: '',
     DateHolder: null,
    };

    this._insert = this._insert.bind(this);

    this.db = SQLite.openDatabase({name: 'placedb', createFromLocation : '~db.sqlite'}, this.openDb, this.errorDb);
  }

  _insert() {
    this.db.transaction((tx) => {
      tx.executeSql('INSERT INTO places(name,city,date) VALUES(?,?,?)', [
        this.state.name,
        this.state.city,
        this.state.dobDate,
      ]);
    });

    this.props.navigation.getParam('refresh')();
    this.props.navigation.goBack();
  }

  DatePickerMainFunctionCall = () => {

      let DateHolder = this.state.DateHolder;

      if(!DateHolder || DateHolder == null){

        DateHolder = new Date();
        this.setState({
          DateHolder: DateHolder
        });
      }

      //To open the dialog
      this.refs.DatePickerDialog.open({

        date: DateHolder,

      });

    }

    onDatePickedFunction = (date) => {
        this.setState({
          dobDate: moment(date).valueOf(),
          DateText: moment(date).format('DD-MMM-YYYY'),
          
        });
      }



  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
          label={'City'}
          value={this.state.city}
          onChangeText={(city) => {this.setState({city})}}
          orientation={'vertical'}
        />

        <Text style={{textAlign: 'left'}}>Date</Text>

         <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >
          
           <View style={styles.datePickerBox}style={{flex: 3}}>
           
             <Text style={styles.datePickerText}>{this.state.DateText}</Text>

           </View>

         </TouchableOpacity>


       {/* Place the dialog component at end of your views and assign the references, event handlers to it.*/}
       <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />

       
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._insert}
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
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  content: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  datePickerBox:{
    marginTop: 9,
    borderColor: '#FF5722',
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent:'center'
  },

  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#000',

  }
});
