import "regenerator-runtime/runtime";
import React, { Component } from "react";
import logo from "./assets/logo.svg";
import nearlogo from "./assets/gray_near_logo.svg";
import near from "./assets/near.svg";
import "./App.css";

import Button from "@material-ui/core/Button";

import ReadyDialog from "./components/dialogs/ReadyDialog.component";
import ConfirmVoteDialog from "./components/dialogs/ConfirmVoteDialog.component";
import ThankYouDialog from "./components/dialogs/ThankYouDialog.component";
import LoadingBackdrop from "./components/backdrops/LoadingBackdrop.component";
import ValidateForm from "./components/dialogs/ValidateForm.component";

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
      validationFormOpen: false,
      confirmVoteDialogOpen: false,
      voteButtonsDisabled: true,
      loadingBackdropOpen: false,
      thankYouDialogOpen: false,
    };
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changeGreeting = this.changeGreeting.bind(this);
    this.pollButtonClicked = this.pollButtonClicked.bind(this);
    this.resetButtonClicked = this.resetButtonClicked.bind(this);
    this.updateReadyToVote = this.updateReadyToVote.bind(this);
    this.updateValidateForm = this.updateValidateForm.bind(this);
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
    this.setState({
      login: true,
      readyDialogOpen: false,
      voteButtonsDisabled: false,
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
    const response = await this.props.contract.welcome({
      account_id: accountId,
    });
    this.setState({ speech: response.text });
  }

  async requestSignIn() {
    const appTitle = "dApp Voter";
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    );
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
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
      thankYouDialogOpen: false,
    });
  }

  async incrementVote(value) {
    await this.props.contract
      .increment_vote({ candidate: value })
      .then(async (result) => {
        this.setState({ loadingBackdropOpen: false, thankYouDialogOpen: true });
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
    this.setState({
      readyToVote: true,
      readyDialogOpen: false,
      validationFormOpen: true,
    });
  }

  updateValidateForm() {
    this.setState({
      validationFormOpen: false,
      voteButtonsDisabled: false,
    });
  }

  toggleConfirmVoteDialogOpen() {
    this.setState({ confirmVoteDialogOpen: !this.state.confirmVoteDialogOpen });
  }

  confirmVote() {
    if (this.state.vote) {
      this.incrementVote(this.state.vote);
      this.setState({ voteButtonsDisabled: true, loadingBackdropOpen: true });
    } else {
      console.log("err: vote null", this.state.vote);
    }
  }

  render() {
    return (
      <div className="app">
        <div className="backdrops">
          <LoadingBackdrop open={this.state.loadingBackdropOpen} />
        </div>
        <div className="app-header">
          <h1>dApp-Voter</h1>
          <h4>Decentralized voting application.</h4>
        </div>
        <div className="app-body">
          <div className="dialogs">
            <ReadyDialog
              open={this.state.readyDialogOpen}
              updateReadyToVote={this.updateReadyToVote}
            />
            <ValidateForm
              open={this.state.validationFormOpen}
              updateValidateForm={this.updateValidateForm}
              requestSignIn={this.requestSignIn}
            />
            <ConfirmVoteDialog
              open={this.state.confirmVoteDialogOpen}
              confirmVote={this.confirmVote}
              toggleConfirmVoteDialogOpen={this.toggleConfirmVoteDialogOpen.bind(
                this
              )}
            />
            <ThankYouDialog
              open={this.state.thankYouDialogOpen}
              requestSignOut={this.requestSignOut}
            />
          </div>
          {this.state.login ? (
            <div className="poll">
              <div className="wallet-info">
                <div className="greeting">
                  <p className="greet">{this.state.speech}</p>
                </div>
              </div>

              <div className="login-buttons">
                <Button variant="contained" onClick={this.requestSignOut}>
                  Log out/Cancel Vote
                </Button>
              </div>
              <p className="subtitle">This is the ballot</p>
              <div className="poll-buttons">
                <Button
                  disabled={this.state.voteButtonsDisabled}
                  onClick={() => this.pollButtonClicked(1)}
                  color="primary"
                  variant="contained"
                >
                  Vote this way
                </Button>
                <Button
                  disabled={this.state.voteButtonsDisabled}
                  onClick={() => this.pollButtonClicked(2)}
                  color="secondary"
                  variant="contained"
                >
                  Vote that way
                </Button>
              </div>
              {false === true && (
                <div className="poll-counts">
                  <p>
                    count1:{" "}
                    {this.state.count1 === null ? "..." : this.state.count1}
                  </p>
                  <p>
                    count2:{" "}
                    {this.state.count2 === null ? "..." : this.state.count2}
                  </p>

                  <div className="reset-button">
                    <Button onClick={() => this.resetButtonClicked()}>
                      RESET COUNT
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            this.state.readyToVote && (
              <div>
                <Button variant="contained" onClick={this.requestSignIn}>
                  Log in with NEAR
                </Button>
              </div>
            )
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
