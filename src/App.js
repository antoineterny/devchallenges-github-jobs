import "./App.scss"
// import React from "react"
import { Component, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom"

import london2401 from "./london2401.json"

export default class App extends Component {
  state = {
    descriptionTerm: "",
    locationTerm: "London",
    fullTimeSearch: false,
    searchResult: [],
    resultPages: [],
    currentPage: 1,
    selectedJob: {},
  }

  componentDidMount() {
    this.setState({ searchResult: london2401, resultPages: this.chunk(london2401, 5) })
    // this.getJobs()
  }

  getJobs = async () => {
    const corsAnywhere = "https://cors-anywhere.herokuapp.com/"
    const baseURL = "https://jobs.github.com/positions.json?"
    const description = this.state.descriptionTerm
      ? "description=" + this.state.descriptionTerm.trim().toLowerCase().replace(" ", "+")
      : ""
    const location = this.state.locationTerm
      ? "&location=" + this.state.locationTerm.trim().toLowerCase().replace(" ", "+")
      : ""
    const fulltime = this.state.fullTimeSearch ? "&full_time=true" : ""
    const response = await fetch(corsAnywhere + baseURL + description + location + fulltime)
    console.log(corsAnywhere + baseURL + description + location + fulltime)
    const data = await response.json()
    this.setState({ searchResult: data })
    this.setState({ resultPages: this.chunk(data, 5) })
  }

  chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    )

  onTitleInputChange = e => this.setState({ descriptionTerm: e.target.value })

  onLocationInputChange = e => this.setState({ locationTerm: e.target.value })

  onCitySelect = city => {
    this.setState({ locationTerm: city }, this.getJobs)
  }

  onFullTimeSelect = () =>
    this.setState({ fullTimeSearch: !this.state.fullTimeSearch }, this.getJobs)

  onFormSubmit = e => {
    e.preventDefault()
    this.getJobs()
  }

  onJobClick = job => this.setState({ selectedJob: job })

  onPaginationClick = arg => {
    const newPage =
      arg === "-" ? this.state.currentPage - 1 : arg === "+" ? this.state.currentPage + 1 : arg.i
    this.setState({ currentPage: newPage })
  }

  render() {
    return (
      // https://reactrouter.com/
      <Router>
        <ScrollToTop />
        <div className="App">
          <h1>
            Github <span>Jobs</span>
          </h1>
          <Switch>
            <Route path="/details">
              <Details job={this.state.selectedJob} />
            </Route>
            <Route path="/">
              <Home
                onJobClick={this.onJobClick}
                onTitleInputChange={this.onTitleInputChange}
                onLocationInputChange={this.onLocationInputChange}
                onFormSubmit={this.onFormSubmit}
                resultPages={this.state.resultPages}
                currentPage={this.state.currentPage}
                locationTerm={this.state.locationTerm}
                descriptionTerm={this.state.descriptionTerm}
                onPaginationClick={this.onPaginationClick}
                onCitySelect={this.onCitySelect}
                onFullTimeSelect={this.onFullTimeSelect}
              />
            </Route>
          </Switch>
          <footer>Antoine Terny @ DevChallenges.io</footer>
        </div>
      </Router>
    )
  }
}

function Home({
  onJobClick,
  onTitleInputChange,
  onLocationInputChange,
  onFormSubmit,
  resultPages,
  currentPage,
  locationTerm,
  descriptionTerm,
  onPaginationClick,
  onCitySelect,
  onFullTimeSelect,
}) {
  const displayedPages = resultPages[currentPage - 1]
  return (
    <div className="Home">
      <header>
        <form onSubmit={onFormSubmit}>
          <i className="material-icons">work_outline</i>
          <input
            type="text"
            placeholder="Title, companies, expertise or benefits"
            onChange={onTitleInputChange}
            value={descriptionTerm}
          />
          <input type="submit" value="Search" />
        </form>
      </header>
      <main>
        <aside>
          <form onSubmit={onFormSubmit}>
            <div className="aside-checkbox">
              <input type="checkbox" name="fulltime" id="fulltime" onClick={onFullTimeSelect} />
              <label htmlFor="fulltime">Full time</label>
            </div>

            <h4 htmlFor="location">Location</h4>

            <div className="aside-search-wrapper">
              <i className="material-icons">public</i>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="City, state, zip code or country"
                onChange={onLocationInputChange}
                value={locationTerm}
              />
            </div>

            <div className="aside-radio-wrapper">
              <div className="aside-radio">
                <input
                  type="radio"
                  name="city"
                  id="london"
                  onChange={() => onCitySelect("London")}
                  defaultChecked
                />
                <label htmlFor="london">London</label>
              </div>
              <div className="aside-radio">
                <input
                  type="radio"
                  name="city"
                  id="amsterdam"
                  onChange={() => onCitySelect("Amsterdam")}
                />
                <label htmlFor="amsterdam">Amsterdam</label>
              </div>
              <div className="aside-radio">
                <input
                  type="radio"
                  name="city"
                  id="newyork"
                  onChange={() => onCitySelect("New York")}
                />
                <label htmlFor="newyork">New York</label>
              </div>
              <div className="aside-radio">
                <input
                  type="radio"
                  name="city"
                  id="berlin"
                  onChange={() => onCitySelect("Berlin")}
                />
                <label htmlFor="berlin">Berlin</label>
              </div>
            </div>
          </form>
        </aside>
        <section>
          {displayedPages &&
            displayedPages.map(job => <JobCard job={job} key={job.id} onJobClick={onJobClick} />)}
          <Pagination
            nbPages={resultPages.length}
            currentPage={currentPage}
            onPaginationClick={onPaginationClick}
          />
        </section>
      </main>
    </div>
  )
}

function JobCard({ job, onJobClick }) {
  const jobDate = new Date(job.created_at)
  const today = new Date()
  const diff = today - jobDate
  const daysAgo = Math.floor(diff / 1000 / 60 / 60 / 24)
  return (
    <div className="job-card" onClick={() => onJobClick(job)}>
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
            {job.type === "Full Time" ? <div className="full-time">Full Time</div> : null}
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

function Pagination({ nbPages, currentPage, onPaginationClick }) {
  let paginationButtons = [
    <button
      key="-"
      type="button"
      className="pagination-button"
      onClick={() => onPaginationClick("-")}
      disabled={currentPage === 1}
    >
      <i className="material-icons">keyboard_arrow_left</i>
    </button>,
  ]
  for (let i = 1; i <= nbPages; i++) {
    const cn = i === currentPage ? "pagination-button active" : "pagination-button"
    paginationButtons.push(
      <button key={i} type="button" className={cn} onClick={() => onPaginationClick({ i })}>
        {i}
      </button>
    )
  }
  paginationButtons.push(
    <button
      key="+"
      type="button"
      className="pagination-button"
      onClick={() => onPaginationClick("+")}
      disabled={currentPage === nbPages}
    >
      <i className="material-icons">keyboard_arrow_right</i>
    </button>
  )
  if (nbPages > 1) {
    return <div className="Pagination">{paginationButtons}</div>
  }
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
