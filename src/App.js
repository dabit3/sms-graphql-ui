import React, {
  useEffect, useState, useReducer
} from 'react';
import './App.css';
import { API, graphqlOperation } from 'aws-amplify'
import getName from './person'

const ReactMarkdown = require('react-markdown')

const onCreateSMS = `
  subscription onCreateSMS {
    onCreateSMS {
      originationNumber
      messageBody

    }
  }
`

const listSMS = `query listSMS {
  listSMS {
    items {
      originationNumber
      messageBody
    }
  }
}`


function reducer(state, action) {
  switch(action.type) {
    case 'SET_ITEMS': 
      return {
        ...state, items: action.items
      }
    case 'ADD_ITEM':
      const items = [
        action.item, ...state.items
      ]
      return {
        ...state, items
      }
    default:
      return state
  }
}

const initialState = {
  items: []
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log('state:', state)
  useEffect(() => {
    fetchItems()
    API.graphql(graphqlOperation(onCreateSMS))
      .subscribe({
        next: itemData => {
          const item = itemData.value.data.onCreateSMS
          dispatch({
            type: 'ADD_ITEM', item
          })
        }
      })
  }, [])

  async function fetchItems() {
    try {
      const itemData = await API.graphql(graphqlOperation(listSMS))
      console.log('itemData:', itemData)
      dispatch({
        type: 'SET_ITEMS', items: itemData.data.listSMS.items
      })
    } catch (err) {
      console.log({ err })
    }
  }
  console.log('state: ', state)

  return (
    <div className="App">
      <h3
        style={styles.feedback}
      >Leave feedback at 910-249-6765</h3>
      {
        state.items.map((item, index) => {
          const name = getName()
          return (
            <div key={index} style={styles.container}>
              <p>From: {name}</p>
              <ReactMarkdown source={item.messageBody} />
           </div>
          )
        })
      }
    </div>
  );
}

const styles = {
  feedback: {
    backgroundColor: '#463744',
    padding: 30,
    margin: 0,
    color: 'white',
    fontWeight: '400',
    fontSize: 36
  },
  container: {
    borderBottom: '2px solid #ddd'
  }
}

export default App;
