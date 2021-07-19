import React, { Fragment } from 'react';
import loader from './spinner.gif'

const Spinner = () => {
    return (
        <Fragment>
            <img src = {loader} style = {{ width: "100px", margin: "350px auto", display:"block" }} alt = "Loading..." />
        </Fragment>
    )
}

export default Spinner
