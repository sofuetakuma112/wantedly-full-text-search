import { Pagination } from "react-bootstrap";
import cssModule from "./style.module.css";
import { range } from "@/utils/util";

const Paging = ({
  pageNumber,
  maxPageNumber,
  handleClickPagination,
}: {
  pageNumber: number;
  maxPageNumber: number;
  handleClickPagination: (nextPageNumber: number) => void;
}) => {
  const createPaginationArray = (pageNumber: number) => {
    // 引数からページネーションの番号配列を作成する
    // pageNumber === 1 ? 左0右4
    // pageNumber === 2 ? 左1右4
    // pageNumber === 3 ? 左2右4
    // pageNumber === 4 ? 左3右4
    // pageNumber > 4 ? 左4右4
    // pageNumber === 100 ? 左4右0
    // pageNumber === 99 ? 左4右1
    // pageNumber === 98 ? 左4右2
    // pageNumber === 97 ? 左4右3
    // pageNumber < 97 ? 左4右4
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
    <Pagination className={cssModule.pagination}>
      <Pagination.First onClick={() => handleClickPagination(1)} />
      <Pagination.Prev onClick={() => handleClickPagination(pageNumber - 1)} />
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
      <Pagination.Next onClick={() => handleClickPagination(pageNumber + 1)} />
      <Pagination.Last onClick={() => handleClickPagination(maxPageNumber)} />
    </Pagination>
  );
};

export default Paging;
