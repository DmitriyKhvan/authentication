import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllPeople } from '../../../actions/peopleList'
import { logout } from '../../../actions/auth';
import Button from '../../UI/button/button';
import Loader from '../../UI/loader/loader';
import classes from './home.module.css';

const HomePage = (props) => {

  const peopleList = (
    <ul>
    {
        props.peopleList.map((person, index) => {
        return (
          <li key={index}>{person}</li>
        )
      })
    }
    </ul>
  )

  return (
    <div className={classes.home}>
      {
        props.loader
        ? <Loader />
        : peopleList
      }
      <Button
        type={'success'}
        onClick={() => props.getAllPeople('/people.json', 'get', props.history)}
        disabled={false}
      >
        Показать список
      </Button>

      <Button
        type={'danger'}
        onClick={() => props.logout(props.history)}
        disabled={false}
      >
        Выход
      </Button>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    peopleList: state.people.people,
    loader: state.people.loader
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllPeople: (url, method, history) => dispatch(getAllPeople(url, method, history)),
    logout: (history) => dispatch(logout(history))
  }
}

export default withRouter(
                connect(mapStateToProps, mapDispatchToProps)(HomePage));