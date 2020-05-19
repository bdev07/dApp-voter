import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ReadyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      license: "000000",
      licenseError: false,
      licenseHelperText: "",
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.handleLicenseChange = this.handleLicenseChange.bind(this);
    this.handleRequestSignIn = this.handleRequestSignIn.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  setOpen(bool) {
    this.setState({ open: bool });
  }

  handleClickOpen() {
    this.setOpen(true);
  }

  handleRequestSignIn() {
    // validate form data
    console.log(/^[a-zA-Z0-9\-_]{7,15}$/.test(this.state.license));
    if (/^[a-zA-Z0-9\-_]{7,15}$/.test(this.state.license)) {
      // initiate NEAR login sequence
    } else {
      this.setState({
        licenseError: true,
        licenseHelperText:
          "License # invalid.  Letters and numbers only, at least 7 characters.",
      });
    }
    // close dialog
  }

  handleClose() {
    this.setOpen(false);
    this.props.updateValidateForm();
  }

  handleLicenseChange(event) {
    this.setState({ license: event.target.value });
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
            {"Validate Voting Eligibility"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Just enter dummy info for this demo.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="dlicense"
              label="Driver License #"
              value={this.state.license}
              type="text"
              fullWidth
              onChange={this.handleLicenseChange}
              error={this.state.licenseError}
              helperText={this.state.licenseHelperText}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleRequestSignIn}
              color="primary"
              autoFocus
            >
              Request Sign In
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ReadyDialog;
