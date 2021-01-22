import "./App.scss"
import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

export default function App() {
  return (
    <Router>
      <div className="App">
        <h1>
          Github <span>Jobs</span>
        </h1>
        <div>
          {/* <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/details">Details</Link>
              </li>
            </ul>
          </nav> */}

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/details">
              <About />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

class Home extends React.Component {
  state = {
    descriptionTerm: "",
    locationTerm: "",
    searchResult: [],
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
              <label htmlFor="location">Location</label>
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
              <JobCard job={job} />
            ))}
          </section>
        </main>
      </div>
    )
  }
}

function JobCard({ job }) {
  const jobDate = new Date(job.created_at)
  const today = new Date()
  const diff = today - jobDate
  const daysAgo = Math.floor(diff / 1000 / 60 / 60 / 24)
  return (
    <div className="job-card" key={job.id}>
      <div className="job-card-image">
        <img src={job.company_logo} alt="" />
      </div>
      <div className="job-card-description">
        <h5>{job.company}</h5>
        <h3>{job.title}</h3>
        <div className="job-card-details">
          <div>{job.type === "Full Time" ? <div className="full-time">Full Time</div> : null}</div>
          <div className="job-card-spacetime">
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
    </div>
  )
}

function About() {
  return <h2>Details</h2>
}
