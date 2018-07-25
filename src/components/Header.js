import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { logOut } from '../actions/user';
import logo from '../assets/images/logo.png';
import menu from '../assets/images/hamburgr.png';
import './_styles/header.css';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navToggle: false,
      open: false
    };
    this.navToggle = this.navToggle.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.profileLink = this.profileLink.bind(this);
  }

 
  onLogoutClick = () => {
    const { user, history, logOut } = this.props;
    logOut({ token: user.token }, res => {});
  };

  navToggle() {
    this.props._navToggle(!this.state.navToggle);
    console.log(!this.state.navToggle);
    this.setState({ navToggle: !this.state.navToggle });
  }

  profileLink = () => {
    this.props.history.replace('/profile');
  }

  render() {
    const { user, history } = this.props;
    const { classes } = this.props;
    const { open } = this.state;
    const pathname = history.location.pathname;
    const isLoginPage = pathname.indexOf('register') > -1;
    const isRegisterPage = pathname.indexOf('login') > -1;
    const isForgotPasswordPage = pathname.indexOf('forgot_password') > -1;
   
    return (
      !isLoginPage &&
      !isRegisterPage &&
      !isForgotPasswordPage && (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="navbar-brand">
            <Link to="/" className="pull-left">
              <img src={logo} alt="logo" />
            </Link>

            <Link to="/" className="pull-right" onClick={this.navToggle}>
              <img src={menu} alt="logo" />
            </Link>
          </div>

          <button
            type="button"
            className="navbar-toggler"
            data-toggle="collapse"
            //data-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="navbarCollapse" className="collapse navbar-collapse">
            <form className="form-inline my-2 my-lg-0">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>

            <ul className="navbar-nav ml-auto mt-2 mt-md-0">
              <li>
                <span className="proicon">{user.loggedIn ? user.name.charAt(0).capitalizeFirstLetter() : ''}</span>

              </li>

              <li style={{width:80}}>
              <i  
                className={open ? 'fa fa-angle-up' : 'fa fa-angle-down'}
                onClick={() => this.setState({ open: !open })}
                style={{marginTop:12,width:10}}
              />

              <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={() => this.setState({ open: false })}>
                        <MenuList>
                          <MenuItem onClick={this.profileLink}>Profile</MenuItem>
                          <MenuItem onClick={this.onLogoutClick}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

             </li>
            </ul>
          </div>
        </nav>
      )
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired,
  _navToggle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  logOut: bindActionCreators(logOut, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Header))
);
