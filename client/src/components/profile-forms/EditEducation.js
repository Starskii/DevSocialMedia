import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editEducation, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const initialState = {
  school: "",
  degree: "",
  fieldofstudy: "",
  from: "",
  to: "",
  current: false,
  description: "",
  _id: "",
};

const EditEducation = ({
  getCurrentProfile,
  editEducation,
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
      const educationData = initialState;
      for (const key in profile.education) {
        if (profile.education[key]._id === id) {
          for (const bkey in profile.education[key]) {
            if (
              bkey in educationData &&
              profile.education[key][bkey] !== null
            ) {
              if (bkey === "to" || bkey === "from") {
                educationData[bkey] = profile.education[key][bkey].substring(
                  0,
                  10
                );
              } else {
                educationData[bkey] = profile.education[key][bkey];
              }
            }
          }
        }
      }
      setFormData(educationData);
    }
  }, [loading, getCurrentProfile, profile, id]);

  const { school, degree, fieldofstudy, from, to, description, current } =
    formData;

  //Update forms
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //Submit Profile
  const onSubmit = (e) => {
    e.preventDefault();
    editEducation(id, formData, navigate);
  };

  return (
    <section className="container">
      {profile === null ? (
        <Spinner />
      ) : (
        <section className="container">
          <h1 className="large text-primary">Edit Your Education</h1>
          <p className="lead">
            <i className="fas fa-code-branch" /> Add any school or bootcamp that
            you have attended
          </p>
          <small>* = required field</small>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="* School or Bootcamp"
                name="school"
                value={school}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="* Degree or Certificate"
                name="degree"
                value={degree}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Field of Study"
                name="fieldofstudy"
                value={fieldofstudy}
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
                  onChange={() =>
                    setFormData({ ...formData, current: !current })
                  }
                />{" "}
                Current School
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
                placeholder="Program Description"
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

EditEducation.propTypes = {
  editEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  editEducation,
})(EditEducation);
