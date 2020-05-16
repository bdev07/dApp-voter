import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

class ConfirmVoteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };

    this.handleConfirmed = this.handleConfirmed.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setOpen = this.setOpen.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  setOpen(bool) {
    this.setState({ open: bool });
  }

  handleConfirmed() {
    this.props.confirmVote();
    this.handleClose();
  }

  handleClose() {
    this.setOpen(false);
    this.props.toggleConfirmVoteDialogOpen();
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Confirm Vote"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please confirm your vote is correct and you wish to write to the
              blockchain.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleClose} color="primary">
              Change my vote.
            </Button>
            <Button onClick={this.handleConfirmed} color="primary" autoFocus>
              Yes, make my vote.
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConfirmVoteDialog;
