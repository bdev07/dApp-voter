import "regenerator-runtime/runtime";
import React, { Component } from "react";
import logo from "./assets/logo.svg";
import nearlogo from "./assets/gray_near_logo.svg";
import near from "./assets/near.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      count1: null,
      count2: null,
    };
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.pollButtonClicked = this.pollButtonClicked.bind(this);
    this.resetButtonClicked = this.resetButtonClicked.bind(this);
  }

  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    console.log("come in sign in flow");
    this.setState({
      login: true,
    });
    const accountId = await this.props.wallet.getAccountId();
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    await this.welcome();
  }

  async welcome() {
    console.log("account id: ", accountId);
    const response = await this.props.contract.welcome({
      account_id: accountId,
    });
    this.setState({ speech: response.text });
  }

  async requestSignIn() {
    const appTitle = "NEAR React template";
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    );
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn());
  }

  async changeGreeting() {
    await this.props.contract.set_greeting({ message: "howdy" });
    await this.welcome();
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    this.setState({
      login: false,
      speech: null,
    });
  }

  async incrementVote(value) {
    await this.props.contract
      .increment_vote({ candidate: value })
      .then(async (result) => {
        if (value === 1) {
          this.setState({
            count1: await this.props.contract.get_candidate_votes({
              candidate: 1,
            }),
          });
        } else {
          this.setState({
            count2: await this.props.contract.get_candidate_votes({
              candidate: 2,
            }),
          });
        }
      });
  }

  async pollButtonClicked(value) {
    console.log("pollButtonClicked(): ", value);
    if (value) {
      if (value === 1) {
        this.setState({ count1: "fetching..." });
      } else {
        this.setState({ count2: "fetching..." });
      }
      this.incrementVote(value);
    }
  }

  async resetButtonClicked() {
    console.log("resetButtonClicked(): ");
    await this.props.contract.reset_votes().then(async () => {
      this.setState({
        count1: await this.props.contract.get_candidate_votes({
          candidate: 1,
        }),
        count2: await this.props.contract.get_candidate_votes({
          candidate: 2,
        }),
      });
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h1>dApp-Voter</h1>
          <h4>Decentralized voting proof of concept.</h4>
        </div>
        <div className="app-body">
          {this.state.login ? (
            <div>
              {/* <div className="wallet-info">
                <div className="greeting">
                  <p className="subtitle">{this.state.speech}</p>
                </div>
                <div className="login-buttons">
                  <button onClick={this.requestSignOut}>Log out</button>
                  <button onClick={this.changeGreeting}>Change greeting</button>
                </div>
              </div> */}
              <p className="subtitle">Who shall rule the throne?</p>
              <div className="poll-buttons">
                <button id="this" onClick={() => this.pollButtonClicked(1)}>
                  Vote for John
                </button>
                <button onClick={() => this.pollButtonClicked(2)}>
                  Vote for Susan
                </button>
              </div>
              <div className="poll-counts">
                <p>
                  count1:{" "}
                  {this.state.count1 === null ? "..." : this.state.count1}
                </p>
                <p>
                  count2:{" "}
                  {this.state.count2 === null ? "..." : this.state.count2}
                </p>
              </div>
              {
                //TODO: only show reset if admin account logged in?
                true === true && (
                  <div className="reset-button">
                    <button onClick={() => this.resetButtonClicked()}>
                      RESET COUNT
                    </button>
                  </div>
                )
              }
            </div>
          ) : (
            <div>
              <button onClick={this.requestSignIn}>Log in with NEAR</button>
            </div>
          )}
        </div>
        <div className="app-footer">
          <div className="footer-links">
            <p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </p>
            <p>
              <a className="App-link" href="https://nearprotocol.com">
                NEAR Website
              </a>
            </p>
            <p>
              <a className="App-link" href="https://docs.nearprotocol.com">
                NEAR Docs
              </a>
            </p>
          </div>
          <div className="near-image-wrapper">
            <p>This page was built with</p>
            <img className="logo" src={nearlogo} alt="NEAR logo" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
