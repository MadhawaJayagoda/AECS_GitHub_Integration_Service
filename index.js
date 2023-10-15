const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// Fetch the number of commits for a user
app.get("/github/commits/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    let commitCount = 0;

    for (const repo of response.data) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/commits`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      commitCount += commitsResponse.data.length;
    }

    res.send(commitCount);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch the total number of releases for a user
app.get("/github/releases/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    let totalReleases = 0;

    // Loop through the user's repositories and fetch releases
    for (const repo of reposResponse.data) {
      const releasesResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/releases`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      totalReleases += releasesResponse.data.length;
    }

    res.send(totalReleases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch the number of pull requests for a user
app.get("/github/pullrequests/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    let prCount = 0;

    for (const repo of response.data) {
      const prsResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/pulls`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      prCount += prsResponse.data.length;
    }

    res.send(prCount);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch the number of issues for a user
app.get("/github/issues/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const issuesResponse = await axios.get(
      `https://api.github.com/search/issues?q=author:${username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    const issueCount = issuesResponse.data.total_count;

    res.send(issueCount);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
