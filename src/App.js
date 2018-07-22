import React, { Component } from 'react';
import './App.css';
import Note from './Note/Note.jsx';
import Noteform from './Noteform/Noteform.jsx';
import {DB_CONFIG} from './config/config.js';
import firebase from 'firebase/app';
import 'firebase/database';

class App extends Component {

  constructor(props){
    super(props);
    this.addNote = this.addNote.bind(this);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database= this.app.database().ref().child('notes');
    this.state = {
      notes: [
      ],
    };
  }

  componentWillMount(){
    this.database.on('child_added', snap => {
        const previousList = this.state.notes;
        previousList.push({
            id: snap.key,
            noteContent: snap.val().noteContent,
        });
        this.setState({
            notes: previousList,
        });
    });

    console.log(this.state.notes);
  }

  addNote(note){
    this.database.push().set({noteContent: note});
  }

  render() {
    return (
      <div className="notesWrapper">
        <div className="notesHeader">
          <div className="heading">Todo App</div>
        </div>
        <div className="notesBody">
          {
            this.state.notes.map((note) => {
              return( 
                <Note noteContent={note.noteContent} noteId={note.id} key={note.id} />
              )
            })
          }
        </div>
        <div className="notesFooter">
          <Noteform addNote={this.addNote}/>
        </div>
      </div>
    );
  }
}

export default App;
