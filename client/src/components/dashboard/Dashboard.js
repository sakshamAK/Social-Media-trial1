import React, { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile'
import Spinner from "../layouts/Spinner";

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: {profile, loading} }) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);
    return (loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className = "large text-primary" style = {{marginTop: '100px'}}>Dashboard</h1>
        <p className = "lead">
            <i className = "fas fa-user">{' '}</i> 
            Welcome { user && user.name }
        </p>
        { profile === null ? <Fragment>
            <p>You have not set up your porfile. Set up your profile below.</p>
            <Link to = "/create-profile" className = "btn btn-primary my-1">Create Profile</Link>
        </Fragment> : 
        <Fragment>
            Has 
        </Fragment> }
    </Fragment>)
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
