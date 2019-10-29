import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import Auth from '../pages/auth/auth';
import HomePage from '../pages/home/home';
import { autoLogin } from '../../actions/auth'

class App extends Component {

  componentDidMount() {
    
    this.props.autoLogin(this.props.history);
  }

  render() {

    let router = (
      <Switch>
        <Route path="/auth" exact component={Auth} />
        <Route render={() => <h2>Page not found</h2>} />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      router = (
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/" exact component={HomePage} />
          <Route render={() => <h2>Page not found</h2>} />
        </Switch>
      );
    }

    return (
      <div>
         {router}
      </div>
     
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token
  }
}

function mapDispatchToProps(dispatch) {
  return {
    autoLogin: (history) => dispatch(autoLogin(history))
  }
}

export default withRouter(
                    connect(mapStateToProps, mapDispatchToProps)(App));