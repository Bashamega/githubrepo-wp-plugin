import React from 'react';
import { FaStar, FaCodeFork } from 'react-icons/fa6'; // Importing react-icons for icons

import lang from '../../assets/color.json';

export function Repo({ data }) {
  const { name, html_url, description, forks, stargazers_count, language } = data;

  return (
    <a href={html_url} className="github-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <span className="github-card__meta">
        <span className="github-card__language-icon" style={{ color: lang[language] }}>●</span> {language}
      </span>
      <div className='flex'>
      <span className="github-card__meta">
        <FaStar  /> {/* Using FaStar icon from react-icons */}
        <span>
          {stargazers_count}
        </span>
      </span>
      <span className="github-card__meta">
        <FaCodeFork /> {/* Using FaCodeFork icon from react-icons */}
        <span>
          {forks}
        </span>
      </span>
      </div>
    </a>
  );
}
