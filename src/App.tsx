import React, { useState, useEffect, useMemo } from "react";
import JobCard from "./components/JobCard";
import SearchForm, { States } from "./components/SearchForm/SearchForm";
import Paging from "./components/Paging";
import cssModule from "./App.module.css";
import { Job } from "./types/type";
import { Carousel } from "react-bootstrap";
import classNames from "classnames";

function App() {
  const [allJobsList, setAllJobsList] = useState<Job[][]>([]);
  const [jobsList, setJobsList] = useState<Job[][]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const maxPageNumber = useMemo(
    () => Math.ceil(allJobsList.length / 10),
    [allJobsList]
  );

  const search = (
    e: React.SyntheticEvent,
    {
      andWord,
      orWord,
      sortCriteriaText,
      sortDirection,
      shouldSummarizeByCompany,
    }: States
  ) => {
    e.preventDefault();
    // if (!andWord && !orWord && (!sortCriteriaText || !sortDirection)) return;
    fetch(
      `http://localhost:3001/filter?andWord=${andWord}&orWord=${orWord}&sortCriteria=${sortCriteriaText}&sortDirection=${sortDirection}&shouldSummarizeByCompany=${shouldSummarizeByCompany}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAllJobsList(data);
        setPageNumber(1);
      });
  };

  const handleClickPagination = (nextPageNumber: number) => {
    if (nextPageNumber < 1 || nextPageNumber > maxPageNumber) return;
    setPageNumber(nextPageNumber);
  };

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((data) => {
        setAllJobsList(data);
      });
  }, []);

  useEffect(() => {
    setJobsList(allJobsList.slice((pageNumber - 1) * 10, pageNumber * 10));
    window.scrollTo(0, 0);
  }, [pageNumber, allJobsList]);

  return (
    <div className={cssModule.app}>
      <SearchForm search={search} />
      <p className={cssModule.searchResult}>{`${pageNumber * 10} / ${
        allJobsList.length
      }`}</p>
      {jobsList.map((jobs: Job[], i: number) => (
        <div key={i}>
          <Carousel
            interval={null}
            wrap={false}
            variant="dark"
            nextIcon={
              <span
                aria-hidden="true"
                className={classNames(
                  "carousel-control-next-icon",
                  cssModule.carouselIcon
                )}
              />
            }
            prevIcon={
              <span
                aria-hidden="true"
                className={classNames(
                  "carousel-control-prev-icon",
                  cssModule.carouselIcon
                )}
              />
            }
          >
            {jobs.map((job) => (
              <Carousel.Item key={job.url}>
                <JobCard {...job} />
              </Carousel.Item>
            ))}
          </Carousel>
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
