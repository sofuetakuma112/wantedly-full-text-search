import React from "react";
import cssModule from "./style.module.css";
import { Job } from "../../types/type";
import JobInfo from "../JobInfo";
import JobEyecatch from "../JobEyecatch";

const JobCard = ({
  title,
  company,
  establishmentDate,
  countOfMember,
  location,
  publishDate,
  view,
  countOfEntry,
  summary,
  tags,
  url,
  eyecatchImgSrc,
  companyThumbnailImgSrc,
}: Job) => {
  return (
    <div className={cssModule.card}>
      <JobEyecatch url={url} eyecatchImgSrc={eyecatchImgSrc} />
      <JobInfo
        title={title}
        company={company}
        establishmentDate={establishmentDate}
        countOfMember={countOfMember}
        location={location}
        publishDate={publishDate}
        view={view}
        countOfEntry={countOfEntry}
        summary={summary}
        tags={tags}
        url={url}
        companyThumbnailImgSrc={companyThumbnailImgSrc}
      />
    </div>
  );
};

export default JobCard;
