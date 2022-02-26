import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import cssModule from "./SearchForm.module.css";

export type States = {
  andWord: string;
  orWord: string;
  sortCriteria: string;
  sortDirection: string;
};

const SearchForm = ({
  search,
}: {
  search: (e: React.SyntheticEvent, states: States) => void;
}) => {
  const [andWord, setAndWord] = useState("");
  const [orWord, setOrWord] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  const sortCriterias = [
    { value: "entry", text: "エントリー数" },
    { value: "countOfView", text: "閲覧数" },
    { value: "publishDate", text: "求人投稿日" },
    { value: "establishmentDate", text: "会社設立日" },
    { value: "countOfMember", text: "会社人数" },
  ];
  const sortDirections = [
    { value: "ascending", text: "昇順(古い順)" },
    { value: "descending", text: "降順(新しい順)" },
  ];
  return (
    <Form
      onSubmit={(e) =>
        search(e, {
          andWord,
          orWord,
          sortCriteria,
          sortDirection,
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
          onChange={(e) => setSortCriteria(e.target.value)}
          value={sortCriteria}
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
          {sortDirections.map(({ value, text }, i) => (
            <option key={i} value={value}>
              {text}
            </option>
          ))}
        </Form.Select>
      </div>
      <Button variant="primary" type="submit">
        検索
      </Button>
    </Form>
  );
};

export default SearchForm;
