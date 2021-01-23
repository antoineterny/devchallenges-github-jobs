import "./App.scss"
import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import react_berlin from "./react_berlin.json"

export default class App extends React.Component {
  state = {
    selectedJob: {},
  }
  onJobClick = job => this.setState({ selectedJob: job })
  render() {
    return (
      // https://reactrouter.com/
      <Router>
        <div className="App">
          <h1>
            Github <span>Jobs</span>
          </h1>
          <Switch>
            <Route path="/details">
              <Details job={this.state.selectedJob} />
            </Route>
            <Route path="/">
              <Home onJobClick={this.onJobClick} />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

class Home extends React.Component {
  state = {
    descriptionTerm: "",
    locationTerm: "",
    // searchResult: [],
    searchResult: react_berlin,
  }
  getJobs = async () => {
    const corsAnywhere = "https://cors-anywhere.herokuapp.com/"
    const baseURL = "https://jobs.github.com/positions.json?"
    const description = this.state.descriptionTerm
      ? "description=" + this.state.descriptionTerm
      : ""
    const location = this.state.locationTerm ? "&location=" + this.state.locationTerm : ""
    console.log(corsAnywhere + baseURL + description + location)
    const response = await fetch(corsAnywhere + baseURL + description + location)
    const data = await response.json()
    console.log(data)
    this.setState({ searchResult: data })
  }
  onTitleInputChange = e => {
    this.setState({ descriptionTerm: e.target.value })
  }
  onLocationInputChange = e => {
    this.setState({ locationTerm: e.target.value })
  }
  onFormSubmit = e => {
    e.preventDefault()
    this.getJobs()
  }

  render() {
    return (
      <div className="Home">
        <header>
          <form onSubmit={this.onFormSubmit}>
            <i className="material-icons">work_outline</i>
            <input
              type="text"
              placeholder="Title, companies, expertise or benefits"
              onChange={this.onTitleInputChange}
              value={this.state.descriptionTerm}
            />
            <input type="submit" value="Search" />
          </form>
        </header>
        <main>
          <aside>
            <form>
              <h4 htmlFor="location">Location</h4>
              <div className="aside-form-wrapper">
                <i className="material-icons">public</i>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="City, state, zip code or country"
                  onChange={this.onLocationInputChange}
                  value={this.state.locationTerm}
                />
              </div>
            </form>
          </aside>
          <section>
            {this.state.searchResult.map(job => (
              <JobCard job={job} onJobClick={this.props.onJobClick} />
            ))}
          </section>
        </main>
      </div>
    )
  }
}

function JobCard({ job, onJobClick }) {
  const jobDate = new Date(job.created_at)
  const today = new Date()
  const diff = today - jobDate
  const daysAgo = Math.floor(diff / 1000 / 60 / 60 / 24)
  return (
    <div className="job-card" key={job.id} onClick={() => onJobClick(job)}>
      <Link to="/details">
        <div className="job-card-image">
          {job.company_logo ? (
            <img src={job.company_logo} alt="" />
          ) : (
            <div className="not-found">not found</div>
          )}
        </div>
        <div className="job-card-description">
          <h5>{job.company}</h5>
          <h3>{job.title}</h3>
          <div className="job-card-details">
            <div>
              {job.type === "Full Time" ? <div className="full-time">Full Time</div> : null}
            </div>
            <div className="spacetime">
              <span>
                <i className="material-icons">public</i>
                {job.location}
              </span>
              <span>
                <i className="material-icons">schedule</i>
                {daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function Details({ job }) {
  const jobDate = new Date(job.created_at)
  const today = new Date()
  const diff = today - jobDate
  const daysAgo = Math.floor(diff / 1000 / 60 / 60 / 24)
  return (
    <div className="Details">
      <aside>
        <div className="back">
          <Link to="/">
            <i className="material-icons">west</i>Back to search
          </Link>
        </div>
        <h4>How to apply</h4>
        <p dangerouslySetInnerHTML={{ __html: job.how_to_apply }}></p>
      </aside>
      {/* https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml */}
      <main>
        <h2>
          {job.title}
          {job.type === "Full Time" ? <div className="full-time">Full Time</div> : null}
        </h2>
        <div className="spacetime">
          <span>
            <i className="material-icons">schedule</i>
            {daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
          </span>
        </div>
        <div className="company">
          {job.company_logo ? (
            <img src={job.company_logo} alt="" />
          ) : (
            <div className="not-found">not found</div>
          )}
          <div>
            <h3>{job.company}</h3>
            <div className="spacetime">
              <span>
                <i className="material-icons">public</i>
                {job.location}
              </span>
            </div>
          </div>
        </div>
        <p dangerouslySetInnerHTML={{ __html: job.description }}></p>
      </main>
    </div>
  )
}
