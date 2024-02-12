/* eslint-disable @next/next/no-img-element */
import React from "react";
import cssModule from "./style.module.css";
import { Badge } from "react-bootstrap";
import { JobMeta } from "@/types/type";

function JobInfo({
  title,
  company,
  establishmentDate,
  countOfMember,
  location,
  publishDate,
  view,
  countOfEntry,
  tags,
  url,
  companyThumbnailImgSrc,
  summary,
}: JobMeta) {
  return (
    <>
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
            <img
              src={companyThumbnailImgSrc || "/assets/noimage.png"}
              alt="companyAvatar"
            />
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
    </>
  );
}

export default JobInfo;
