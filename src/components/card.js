import React from 'react';
import lang from '../../assets/color.json';

export function Repo({ data }) {
  const { name, html_url, description, forks, stargazers_count, language } = data;

  return (
    <a href={html_url} class="github-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <span class="github-card__meta">
        <span class="github-card__language-icon" style={{'color': lang[language]}}>●</span> {language}
      </span>
      <span class="github-card__meta">
        <i class="fa fa-star" aria-hidden="true"></i>
        <span data-stars>
          {stargazers_count}
        </span>
      </span>
      <span class="github-card__meta">
        <i class="fa fa-code-fork" aria-hidden="true"></i>
        <span data-forks>
          {forks}
        </span>
      </span>
    </a>
  );
}
