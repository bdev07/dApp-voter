import "regenerator-runtime/runtime";
import React, { Component } from "react";
import logo from "./assets/logo.svg";
import nearlogo from "./assets/gray_near_logo.svg";
import near from "./assets/near.svg";
import "./App.css";

import ReadyDialog from "./components/dialogs/ReadyDialog.component";
import ConfirmVoteDialog from "./components/dialogs/ConfirmVoteDialog.component";

// TODO: add dialogue to confirm vote before writing to blockchain

// TODO: ensure sign will complete every time, one account per browser session

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      count1: null,
      count2: null,
      vote: null,
      readyToVote: false,
      readyDialogOpen: true,
      confirmVoteDialogOpen: false,
    };
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.pollButtonClicked = this.pollButtonClicked.bind(this);
    this.resetButtonClicked = this.resetButtonClicked.bind(this);
    this.updateReadyToVote = this.updateReadyToVote.bind(this);
    this.confirmVote = this.confirmVote.bind(this);
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
      count1: await this.props.contract.get_candidate_votes({
        candidate: 1,
      }),
      count2: await this.props.contract.get_candidate_votes({
        candidate: 2,
      }),
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
    // open confirm vote dialog
    if (value) {
      if (value === 1) {
        this.setState({
          confirmVoteDialogOpen: true,
          vote: 1,
        });
      } else {
        this.setState({
          confirmVoteDialogOpen: true,
          vote: 2,
        });
      }
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

  updateReadyToVote() {
    this.setState({ readyToVote: true, readyDialogOpen: false });
  }

  toggleConfirmVoteDialogOpen() {
    this.setState({ confirmVoteDialogOpen: !this.state.confirmVoteDialogOpen });
  }

  confirmVote() {
    if (this.state.vote) {
      this.incrementVote(this.state.vote);
    } else {
      console.log("err: vote null", this.state.vote);
    }
  }

  render() {
    console.log("state", this.state);
    return (
      <div className="app">
        <div className="app-header">
          <h1>dApp-Voter</h1>
          <h4>Decentralized voting proof of concept.</h4>
        </div>
        <h1>HOWS THIS PAGES THING WERK?</h1>

        <div className="app-body">
          <div className="dialogs">
            <ReadyDialog
              open={this.state.readyDialogOpen}
              updateReadyToVote={this.updateReadyToVote}
            />
            <ConfirmVoteDialog
              open={this.state.confirmVoteDialogOpen}
              confirmVote={this.confirmVote}
              toggleConfirmVoteDialogOpen={this.toggleConfirmVoteDialogOpen.bind(
                this
              )}
            />
          </div>
          <div className="wallet-info">
            <div className="greeting">
              <p className="subtitle">{this.state.speech}</p>
            </div>
          </div>
          {this.state.login ? (
            <div className="poll">
              <div className="login-buttons">
                <button onClick={this.requestSignOut}>Log out</button>
                <button onClick={this.changeGreeting}>Change greeting</button>
              </div>
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
