import React, { useState, useEffect, useMemo } from "react";
import JobCard from "@/components/JobCard";
import SearchForm, { States } from "@/components/SearchForm/SearchForm";
import Paging from "@/components/Paging";
import cssModule from "@/styles/Home.module.css";
import { Job } from "@/types/type";
import { Carousel } from "react-bootstrap";
import classNames from "classnames";
import { loadAllJobs } from "@/utils/util";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { filterJobs } from "@/utils/filter";

export default function Home({
  jobs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [allJobsList, setAllJobsList] = useState<Job[][]>(
    jobs.map((job) => [job])
  );
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

    const searchCondition = {
      andWords: (andWord as string).split(/\s+/),
      orWords: (orWord as string).split(/\s+/),
      sortCriteria: sortCriteriaText,
      sortDirection,
      shouldSummarizeByCompany,
    };
    const filteredJobs = filterJobs(searchCondition, jobs);
    setAllJobsList(filteredJobs);
    setPageNumber(1);
  };

  const handleClickPagination = (nextPageNumber: number) => {
    if (nextPageNumber < 1 || nextPageNumber > maxPageNumber) return;
    setPageNumber(nextPageNumber);
  };

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

export const getServerSideProps = (async () => {
  const jobs = await loadAllJobs();
  return { props: { jobs } };
}) satisfies GetServerSideProps<{ jobs: Job[] }>;
