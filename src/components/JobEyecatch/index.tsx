import React from "react";
import noImage from "../../assets/noimage.png";
import cssModule from "./style.module.css";
import { JobImage } from "../../types/type";

function JobEyecatch({ url, eyecatchImgSrc }: JobImage) {
  return (
    <div className={cssModule.imgWrapper}>
      <a href={url} target="_blank" rel="noreferrer">
        <img src={eyecatchImgSrc || noImage} alt="eyecatch" />
      </a>
    </div>
  );
}

export default JobEyecatch;
