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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    // So we can update state later.
    var self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    //const simpleStorage = contract(SimpleStorageContract)
    const conference = contract(Conference)
    //simpleStorage.setProvider(provider)
    conference.setProvider(provider)

    // Get accounts.
    // web3RPC.eth.getAccounts(function(error, accounts) {
    //   console.log(accounts)
    //
    //    simpleStorage.deployed().then(function(instance) {
    //      simpleStorageInstance = instance
    //
    //
    //     // Stores a value of 5.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then(function(result) {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0])
    //   }).then(function(result) {
    //     // Update state with the result.
    //     return self.setState({ storageValue: result.c[0] })
    //   })
    // })

    // Get Web3 so we can get our accounts.
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
