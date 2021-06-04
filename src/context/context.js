import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GitHubUser = ({ children }) => {
  const [gitHubUser, setGitHubUser] = useState(mockUser);
  const [Repos, setRepos] = useState(mockRepos);
  const [Followers, setFollowers] = useState(mockFollowers);

  //request loading
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);

  //error
  const [error, setError] = useState({ show: false, msg: "" });


  //search githubUser
  const searchGitHubUser = async (user)=>{
    toggleError()
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err)=>{
      console.log(err)
    })
    // console.log(response)
    if(response){
      setGitHubUser(response.data)
      await Promise.allSettled(
      [axios(response.data["repos_url"] + "?per_page=100"),
      axios(response.data["followers_url"] + "?per_page=100")
    ]).then((data)=>{
        const [repos,follwers] = data 
        if(repos.status === "fulfilled"){
          setRepos(repos.value.data)
        }
        if(follwers.status === "fulfilled"){
          setFollowers(follwers.value.data)
        }
        setLoading(false)
      }).catch((err)=>{console.log(err);})
    }else{
      toggleError(true,"there is no user with that name")
    }

  }

  //check rate
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        // remaining = 0;
        setRequest(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry you don't have enough request");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    checkRequest();
  }, []);

  //check error
  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };
  // console.log(error);
  return (
    <GithubContext.Provider
      value={{ gitHubUser, Repos, Followers, request, error, searchGitHubUser, loading }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GitHubUser, GithubContext };
