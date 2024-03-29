export type Job = JobImage & JobMeta;

export type JobImage = {
  eyecatchImgSrc: string | null;
  url: string;
};

export type JobMeta = {
  title: string;
  company: string;
  establishmentDate: string;
  countOfMember: string;
  location: string;
  publishDate: string;
  view: string | null;
  countOfEntry: string;
  summary: string;
  tags: string;
  url: string;
  companyThumbnailImgSrc: string | null;
};

// export type CSVJob = {
//   title: string;
//   company: string;
//   establishmentDate: string;
//   countOfMember: string;
//   location: string;
//   publishDate: string;
//   view: string;
//   countOfEntry: string;
//   description: string;
//   summary: string;
//   tags: string;
//   url: string;
//   eyecatchImgSrc: string;
//   companyThumbnailImgSrc: string;
// };
