import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import { loadSavedData, saveDataInStorage } from '../renderer';
import List from "./List";
const { ipcRenderer } = require("electron")
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA } = require("../../utils/constants")

const Home = () => {
  const [val, setVal] = useState('');
  const [itemsToTrack, setItems] = useState([]);
  
  // Grab the user's saved itemsToTrack after the app loads
  useEffect(() => {
    loadSavedData();
  }, []);
  
  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewItem)
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewItem)
    }
  });
  
  useEffect(() => {
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveData)
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveData)
    }
  });
  
  useEffect(() => {
    ipcRenderer.on(HANDLE_REMOVE_DATA, handleReceiveData);
    return () => {
      ipcRenderer.removeListener(HANDLE_REMOVE_DATA, handleReceiveData);
    } 
  });
  
  // Receives itemsToTrack from main and sets the state
  const handleReceiveData = (event, data) => {
    console.log('data received!')
    setItems([...data.message]);
  }
  
  // Receives a new item back from main
  const handleNewItem = (event, data) => {
    console.log('Renderer received new item:', data.message)
    setItems([...itemsToTrack, data.message])
  }
  
  // Manage state and input field
  const handleChange = e => {
    setVal(e.target.value)
  }
  
  // Send the input to main
  const addItem = (input) => {
    console.log("react triggered addItem with", input)
    saveDataInStorage(input)
    setVal('')
  };
  
  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <Button variant="outline-primary" onClick={() => addItem(val)}>
            New Item
          </Button>
        </InputGroup.Prepend> 
        <input type="text" onChange={handleChange} value={val} />
      </InputGroup>
      {itemsToTrack.length ? (
        <List itemsToTrack={itemsToTrack} />
      ) : (
        <p>Add an item to get started</p>
      )}
    </div>
  )
};

export default Home;