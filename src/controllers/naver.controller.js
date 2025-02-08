const { default: axios } = require("axios");

exports.getNews = async (req, res) => {
  try {
    axios
      .get(`https://openapi.naver.com/v1/search/news.json`, {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_NEWS_API_ID,
          "X-Naver-Client-Secret": process.env.NAVER_NEWS_API_SECRET,
        },
        params: {
          query: "기업",
          diaply: 100,
        },
      })
      .then((data) => {
        res.status(200).json(data.data.items);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news", details: err });
  }
};
