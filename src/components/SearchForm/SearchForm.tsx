import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import cssModule from "./SearchForm.module.css";

export type States = {
  andWord: string;
  orWord: string;
  sortCriteriaText: string;
  sortDirection: string;
  shouldSummarizeByCompany: boolean
};

type SortCriteria = {
  value: string;
  text: string;
  ascending: string;
  descending: string;
};

const SearchForm = ({
  search,
}: {
  search: (e: React.SyntheticEvent, states: States) => void;
}) => {
  const [andWord, setAndWord] = useState("");
  const [orWord, setOrWord] = useState("");
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
    value: "",
    text: "",
    ascending: "昇順",
    descending: "降順",
  });
  const [sortDirection, setSortDirection] = useState("");
  const [shouldSummarizeByCompany, setShouldSummarizeByCompany] =
    useState(false);

  const ascOfCount = "少ない順";
  const descOfCount = "多い順";
  const ascOfDate = "古い順";
  const descOfDate = "新しい順";

  const sortCriterias = [
    {
      value: "entry",
      text: "エントリー数",
      ascending: ascOfCount,
      descending: descOfCount,
    },
    {
      value: "countOfView",
      text: "閲覧数",
      ascending: ascOfCount,
      descending: descOfCount,
    },
    {
      value: "publishDate",
      text: "求人投稿日",
      ascending: ascOfDate,
      descending: descOfDate,
    },
    {
      value: "establishmentDate",
      text: "会社設立日",
      ascending: ascOfDate,
      descending: descOfDate,
    },
    {
      value: "countOfMember",
      text: "会社人数",
      ascending: ascOfCount,
      descending: descOfCount,
    },
  ];
  const sortDirections = [{ value: "ascending" }, { value: "descending" }];
  return (
    <Form
      onSubmit={(e) =>
        search(e, {
          andWord,
          orWord,
          sortCriteriaText: sortCriteria.value,
          sortDirection,
          shouldSummarizeByCompany,
        })
      }
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="text"
          value={andWord}
          onChange={(e) => setAndWord(e.target.value)}
          placeholder="type and words"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="type or words"
          value={orWord}
          onChange={(e) => setOrWord(e.target.value)}
        />
      </Form.Group>
      <div className={cssModule.sortWrapper}>
        <Form.Select
          aria-label="Default select example"
          className={cssModule.sortPropertySelector}
          onChange={(e) =>
            setSortCriteria(
              sortCriterias.find(
                (sc) => sc.value === e.target.value
              ) as SortCriteria
            )
          }
          value={sortCriteria.value}
        >
          <option>ソート基準</option>
          {sortCriterias.map(({ value, text }, i) => (
            <option key={i} value={value}>
              {text}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          aria-label="Default select example"
          className={cssModule.sortDirectionSelector}
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option>ソート方向</option>
          {sortDirections.map(({ value }, i: number) => (
            <option key={i} value={value}>
              {sortCriteria[value as keyof SortCriteria]}
            </option>
          ))}
        </Form.Select>
      </div>
      <Form.Check
        type="checkbox"
        id={`default-checkbox`}
        label="会社ごとに求人をまとめて表示する"
        onChange={() => setShouldSummarizeByCompany((oldValue) => !oldValue)}
        checked={shouldSummarizeByCompany}
      />
      <Button variant="primary" type="submit">
        検索
      </Button>
    </Form>
  );
};

export default SearchForm;
