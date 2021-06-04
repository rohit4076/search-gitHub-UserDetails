import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { Repos } = React.useContext(GithubContext);
  // console.log(Repos)

  let languageObj = {};
  let starsObj = {};
  Repos.forEach(
    (element) => {
      const { language, stargazers_count } = element;
      if (language != null) {
        if (!languageObj[language]) {
          languageObj[language] = 1;
          starsObj[language] = stargazers_count;
        } else {
          languageObj[language] += 1;
          starsObj[language] += stargazers_count;
        }
      }
    },
    languageObj,
    starsObj
  );

  //for language calculation
  let languageArr = [];
  for (const key in languageObj) {
    languageArr.push({
      label: key,
      value: languageObj[key],
    });
  }

  // for stars calculation
  let starsArr = [];
  for (const key in starsObj) {
    starsArr.push({
      label: key,
      value: starsObj[key],
    });
  }

  //for maximum stars and forks

  
  let { stars, forks } = Repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[name] = stargazers_count
      total.forks[name] = forks
      return total
    },{
      stars: {},
      forks: {},
    });

    let maxArrayOfStars=[]
    for(const key in stars){
      maxArrayOfStars.push({
        label:key,
        value:stars[key]
      })
    }

    const newMaxArrayOfStars = maxArrayOfStars.sort((a,b)=>{
      return b.value - a.value
    }).slice(0,5)
    

    let maxArrayOfForks = []
    for(const key in forks){
      maxArrayOfForks.push({
        label:key,
        value:forks[key]
      })
    }

    const newMaxArrayOfForks = maxArrayOfForks.sort((a,b)=>{
      return b.value - a.value
    }).slice(0,5)

  
    
  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={languageArr} />
        <Column3D data={newMaxArrayOfStars}></Column3D>
        <Doughnut2D data={starsArr} />
        <Bar3D data={newMaxArrayOfForks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
