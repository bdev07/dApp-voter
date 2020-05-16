import React, { Component } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class LoadingBackdrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleClose() {
    this.setState({ open: false });
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  render() {
    return (
      <div>
        <Backdrop
          className={this.props.classes.backdrop}
          open={this.state.open}
          onClick={this.handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(styles)(LoadingBackdrop);
