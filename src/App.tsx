import React, { useState, useEffect, useMemo } from "react";
import { Form, Button, Pagination } from "react-bootstrap";
import cssModule from "./App.module.css";
import JobCard from "./components/JobCard/JobCard";
import { Job } from "./types/type";

function App() {
  const [andWord, setAndWord] = useState("");
  const [orWord, setOrWord] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const maxPageNumber = useMemo(
    () => Math.ceil(allJobs.length / 10),
    [allJobs]
  );
  const search = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!andWord && !orWord) return;
    fetch(`http://localhost:3001/filter?andWord=${andWord}&orWord=${orWord}`)
      .then((res) => res.json())
      .then((data) => setAllJobs(data));
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

  const handleClickPagination = (nextPageNumber: number) => {
    if (nextPageNumber < 1 || nextPageNumber > maxPageNumber) return;
    setPageNumber(nextPageNumber);
  };

  const range = (length: number, startNumber: number) =>
    Array.from({ length }, (v, i) => i + startNumber);

  const createPaginationArray = (pageNumber: number) => {
    // 引数からページネーションの番号配列を作成する
    // pageNumber === 1 ? 左0右4
    // pageNumber === 2 ? 左1右4
    // pageNumber === 3 ? 左2右4
    // pageNumber === 4 ? 左3右4
    // pageNumber >= 5 ? 左4右4
    // pageNumber === 100 ? 左4右0
    // pageNumber === 99 ? 左4右1
    // pageNumber === 98 ? 左4右2
    // pageNumber === 97 ? 左4右3
    // pageNumber <= 96 ? 左4右4
    const countOfLeftPagication = pageNumber > 4 ? 4 : pageNumber - 1;
    const countOfRightPagication =
      pageNumber < maxPageNumber - 3 ? 4 : maxPageNumber - pageNumber;
    return [
      ...range(countOfLeftPagication, pageNumber - countOfLeftPagication),
      pageNumber,
      ...range(countOfRightPagication, pageNumber + 1),
    ];
  };

  return (
    <div className={cssModule.app}>
      <Form onSubmit={search}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {/* <Form.Label>Email address</Form.Label> */}
          <Form.Control
            type="text"
            value={andWord}
            onChange={(e) => setAndWord(e.target.value)}
            placeholder="type and words"
          />
          {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="type or words"
            value={orWord}
            onChange={(e) => setOrWord(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          検索
        </Button>
      </Form>
      {jobs.map((job: Job) => (
        <div key={job.url}>
          <JobCard {...job} />
          <hr className={cssModule.horizonLine} />
        </div>
      ))}
      <Pagination className={cssModule.pagination}>
        <Pagination.First onClick={() => handleClickPagination(1)} />
        <Pagination.Prev
          onClick={() => handleClickPagination(pageNumber - 1)}
        />
        {createPaginationArray(pageNumber).map((pageNum) => (
          <Pagination.Item
            key={pageNum}
            active={pageNum === pageNumber}
            value={pageNum}
            onClick={(e: any) => handleClickPagination(Number(e.target.text))}
          >
            {pageNum}
          </Pagination.Item>
        ))}
        <Pagination.Ellipsis />
        <Pagination.Next
          onClick={() => handleClickPagination(pageNumber + 1)}
        />
        <Pagination.Last onClick={() => handleClickPagination(maxPageNumber)} />
      </Pagination>
    </div>
  );
}

export default App;
