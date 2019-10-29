import React from "react";
import classes from './loader.module.css'

const Loader = () => {
  return (
    <div>
      <div className={classes.lds_spinner}>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>
  );
};

export default Loader;
