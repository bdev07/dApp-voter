import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ThankYouDialog extends Component {
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
            {"Thanks For Voting!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your vote has been made! Thank you for voting on the blockchain.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled onClick={this.handleClose}>
              Refresh page to vote again.
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ThankYouDialog;
