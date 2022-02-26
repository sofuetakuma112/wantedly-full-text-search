import React, { useState, useEffect, useMemo } from "react";
import JobCard from "./components/JobCard/JobCard";
import SearchForm, { States } from "./components/SearchForm/SearchForm";
import Paging from "./components/Paging/Paging";
import cssModule from "./App.module.css";
import { Job } from "./types/type";

function App() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const maxPageNumber = useMemo(
    () => Math.ceil(allJobs.length / 10),
    [allJobs]
  );

  const search = (
    e: React.SyntheticEvent,
    { andWord, orWord, sortCriteria, sortDirection }: States
  ) => {
    e.preventDefault();
    if (!andWord && !orWord && (!sortCriteria || !sortDirection)) return;
    fetch(
      `http://localhost:3001/filter?andWord=${andWord}&orWord=${orWord}&sortCriteria=${sortCriteria}&sortDirection=${sortDirection}`
    )
      .then((res) => res.json())
      .then((data) => setAllJobs(data));
  };

  const handleClickPagination = (nextPageNumber: number) => {
    if (nextPageNumber < 1 || nextPageNumber > maxPageNumber) return;
    setPageNumber(nextPageNumber);
  };

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((data) => setAllJobs(data));
  }, []);

  useEffect(() => {
    setJobs(allJobs.slice((pageNumber - 1) * 10, pageNumber * 10));
    window.scrollTo(0, 0);
  }, [pageNumber, allJobs]);

  return (
    <div className={cssModule.app}>
      <SearchForm search={search} />
      <p className={cssModule.searchResult}>{`${pageNumber * 10} / ${
        allJobs.length
      }`}</p>
      {jobs.map((job: Job, i: number) => (
        <div key={job.url}>
          <JobCard {...job} index={i} />
          <hr className={cssModule.horizonLine} />
        </div>
      ))}
      <Paging
        pageNumber={pageNumber}
        maxPageNumber={maxPageNumber}
        handleClickPagination={handleClickPagination}
      />
    </div>
  );
}

export default App;
