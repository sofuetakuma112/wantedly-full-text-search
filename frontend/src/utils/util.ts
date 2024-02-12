import _ from "lodash";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "./firebase";
import Papa from "papaparse";

type Job = {
  title: string;
  company: string;
  establishmentDate: string;
  countOfMember: string;
  location: string;
  publishDate: string;
  view: string;
  countOfEntry: string;
  description: string;
  summary: string;
  tags: string;
  url: string;
  eyecatchImgSrc: string;
  companyThumbnailImgSrc: string;
};

export const loadAllJobs = async (): Promise<any[]> => {
  const listOfJobListForEachCsv = await getCsvFileNameList();
  return _.uniqBy(listOfJobListForEachCsv, "url");
};

export const getCsvFileNameList = (): Promise<Job[]> => {
  const listRef = ref(storage, "");
  return listAll(listRef)
    .then((res) =>
      Promise.all(
        res.items.map(
          async (itemRef) =>
            await getDownloadURL(itemRef).then((url) =>
              fetch(url)
                .then((response) => response.text())
                .then((v) => Papa.parse<Job>(v, { header: true }).data)
            )
        )
      )
    )
    .then((jobsArray: Job[][]) => jobsArray.flat());
};

export const isKeyExists = <T extends object>(
  obj: T,
  key: keyof T
): boolean => {
  return obj[key] !== undefined;
};

export const range = (length: number, startNumber: number) =>
  Array.from({ length }, (v, i) => i + startNumber);
