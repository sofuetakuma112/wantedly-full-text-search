import React from "react";
import cssModule from "./JobCard.module.css";
import { Badge } from "react-bootstrap";
import { Job } from "../../types/type";
import noImage from '../../assets/noimage.png';

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
    <div className={cssModule.jobCard}>
      <div className={cssModule.imgWrapper}>
        <a href={url} target="_blank" rel="noreferrer">
          <img src={eyecatchImgSrc || noImage} alt="eyecatch" />
        </a>
      </div>
      <div className={cssModule.jobMetas}>
        <div className={cssModule.jobTags}>
          {tags.split(",").map((tag, i) => (
            <Badge key={i} pill bg="dark" className={cssModule.jobTag}>
              {tag}
            </Badge>
          ))}
        </div>
        {Number.isInteger(Number(countOfEntry)) && (
          <span className={cssModule.jobMeta}>{countOfEntry}エントリー</span>
        )}
        {view && <span className={cssModule.jobMeta}>{view} views</span>}
        {publishDate !== "1900/01/01" && (
          <span className={cssModule.jobMeta}>{publishDate}</span>
        )}
      </div>
      <h1 className={cssModule.title}>
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      </h1>
      <p>{summary}</p>
      <div className={cssModule.companyInfo}>
        <div className={cssModule.companyInfoLeft}>
          <div className={cssModule.companyAvatarWrapper}>
            <img src={companyThumbnailImgSrc || noImage} alt="companyAvatar" />
          </div>
          <div className={cssModule.companyNameWrapper}>
            <span className={cssModule.companyName}>{company}</span>
          </div>
        </div>
        <div className={cssModule.companyInfoRight}>
          <span>{establishmentDate} に設立</span>
          <br />
          <span>{countOfMember}人のメンバー</span>
          <br />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
