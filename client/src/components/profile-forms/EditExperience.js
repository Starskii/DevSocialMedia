import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editExperience, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const initialState = {
  company: "",
  title: "",
  location: "",
  from: "",
  to: "",
  current: false,
  description: "",
  _id: "",
};

const EditExperience = ({
  getCurrentProfile,
  editExperience,
  profile: { profile, loading },
}) => {
  const { id } = useParams();
  const [formData, setFormData] = useState(initialState);

  const navigate = useNavigate();
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  useEffect(() => {
    if (!loading && profile) {
      const experienceData = initialState;
      for (const key in profile.experience) {
        if (profile.experience[key]._id === id) {
          for (const bkey in profile.experience[key]) {
            if (
              bkey in experienceData &&
              profile.experience[key][bkey] !== null
            ) {
              if (bkey === "to" || bkey === "from") {
                experienceData[bkey] = profile.experience[key][bkey].substring(
                  0,
                  10
                );
              } else {
                experienceData[bkey] = profile.experience[key][bkey];
              }
            }
          }
        }
      }
      setFormData(experienceData);
    }
  }, [loading, getCurrentProfile, profile, id]);

  const { company, title, location, from, to, current, description } = formData;

  //Update forms
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //Submit Profile
  const onSubmit = (e) => {
    e.preventDefault();
    editExperience(id, formData, navigate);
  };

  return (
    <section className="container">
      {profile === null ? (
        <Spinner />
      ) : (
        <section className="container">
          <h1 className="large text-primary">Edit An Experience</h1>
          <p className="lead">
            <i className="fas fa-code-branch" /> Add any developer/programming
            positions that you have had in the past
          </p>
          <small>* = required field</small>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="* Job Title"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="* Company"
                name="company"
                value={company}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Location"
                name="location"
                value={location}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <h4>From Date</h4>
              <input type="date" name="from" value={from} onChange={onChange} />
            </div>
            <div className="form-group">
              <p>
                <input
                  type="checkbox"
                  name="current"
                  checked={current}
                  value={current}
                  onChange={() => {
                    setFormData({ ...formData, current: !current });
                  }}
                />{" "}
                Current Job
              </p>
            </div>
            <div className="form-group">
              <h4>To Date</h4>
              <input
                type="date"
                name="to"
                value={to}
                onChange={onChange}
                disabled={current}
              />
            </div>
            <div className="form-group">
              <textarea
                name="description"
                cols="30"
                rows="5"
                placeholder="Job Description"
                value={description}
                onChange={onChange}
              />
            </div>
            <input type="submit" className="btn btn-primary my-1" />
            <Link className="btn btn-light my-1" to="/dashboard">
              Go Back
            </Link>
          </form>
        </section>
      )}
    </section>
  );
};

EditExperience.propTypes = {
  editExperience: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  editExperience,
})(EditExperience);
