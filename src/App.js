import React, { Component } from 'react'
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Conference from '../build/contracts/Conference.json'
import Web3 from 'web3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accounts: [],
      numRegistrants: 0
    }
  }

  componentWillMount() {
    var self = this
    const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    const conference = contract(Conference)
    conference.setProvider(provider)
    const web3RPC = new Web3(provider)
    var conferenceInstance
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)
      conference.deployed().then(function(instance) {
        conferenceInstance = instance
        return conferenceInstance.numRegistrants.call()
      }).then(function(result) {
        return self.setState({ accounts, numRegistrants: result.c[0] })
      })
    })
  }

  buyTicket = () => {
    var self = this
    const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    const conference = contract(Conference)
    conference.setProvider(provider)
    var conferenceInstance
    conference.deployed().then(function(instance) {
      conferenceInstance = instance
      return conferenceInstance.buyTicket({ from: '0x7d8f8038bf1a353c5a7eb3ba43120081e665d7b6' , value: 100 })
    }).then(
      function() {
        return conferenceInstance.numRegistrants.call()
      }).then(function(result) {
        return self.setState({ numRegistrants: result.c[0]
      })
    })
  }

  render() {
    console.log(this.state)

    var displayAccounts = this.state.accounts.map(account => {
      return <p key={account}>{account}</p>;
    });

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
            {/*}<ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">News</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sports</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Finance</a></li>
            </ul>*/}
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Something</h2>
              <button onClick={this.buyTicket}>Buy Ticket</button>
              <h2>Number of registrants</h2>
              <p>The number of registrants is: {this.state.numRegistrants}</p>
              <h2>Accounts</h2>
              {displayAccounts}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
