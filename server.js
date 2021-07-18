require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const db = require("./database/client");
const auth = require("./middlewares/authorization");
const uuid4 = require("uuid4");

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/blogPosts", (req, res) => {
  db.query(
    `
 SELECT content_id, title, media_url, body, post_date, author, source_url, tags 
 FROM blog_posts;`
  )
    .then((posts) => res.status(200).json(posts.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.post("/blogPosts/create", auth, (req, res, next) => {
  console.log(req);
  const content_id_raw = uuid4();

  const { title, media_url, body, author, source_url, tags } = req.body;

  const content_id = content_id_raw;

  const createNewPost = {
    text: `
  INSERT INTO blog_posts (content_id, title, media_url, body, date, post_date, author, source_url, tags)
  VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE, $5, $6, $7)
  RETURNING *`,
    values: [content_id, title, media_url, body, author, source_url, tags],
  };

  db.query(createNewPost)
    .then((data) => {
      res.status(201).json(data.rows);
    })
    .catch((err) => console.error(err));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
