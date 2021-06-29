require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { Pool } = require("pg");
const app = express();
app.use(cors());
const db = require("./database/client");
const auth = require("./middlewares/authorization");
const uuid4 = require("uuid4")
// const content = require("./contentful-content-only.json");
const port = process.env.PORT || 3001;
const { DateTime } = require("luxon");
app.use(express.json())

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*");
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/blogPosts", (req, res) => {
 db.query(`
 SELECT content_id, title, media_url, body, post_date, author, source_url, tags 
 FROM blog_posts;`)
    .then((posts) => res.status(200).json(posts.rows))
    .catch((e)=> res.status(500).send(e.message)
 )
  // const bodyJsonArray = {hello: "world", bye: "world", myname: "jeff", samsara: "rolling up a boulder... for all eternity"};
  // res.items = bodyJsonArray;
  // console.log({ items: res.items });
  // console.log({ response: res });
  // res.send(res.items);
});

app.post("/blogPosts/create", auth, (req, res, next) => {
  console.log("Received a post on blogPosts/create");
  console.log({post_request : req})
  //console.log({post_body: JSON.stringify(req.body)});
  console.log({auth : req.headers.authorization});
  const content_id_raw = uuid4();
  const currentDate = DateTime.now();
  const currentIsoDate = currentDate.toISODate(); 
  console.log(`current date:${currentDate}`)
  console.log(`current iso date:${currentIsoDate}`)
  const { author, body, media_url, source_url, tags, title} = req.body.newPost;
  console.log({req_body : req.body});
  console.log({author : author});
  console.log({source_url : source_url});
  console.log({content_id: content_id_raw});
  //const content_id = content_id_raw.replace(/-/g,"");
  const content_id = content_id_raw;
  console.log({content_id_fixed: content_id});
const createNewPost = {
  text: `
  INSERT INTO blog_posts (content_id, title, media_url, body, date, post_date, author, source_url, tags)
  VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE, $5, $6, $7)
  RETURNING *`,
  values: [content_id, title, media_url, body, author, source_url, tags],
}

console.log({new_post : createNewPost});  

db.query(createNewPost)
.then((data) => {
  res.status(201).json(data.rows);
})
.catch((err) => console.error(err));
});
// db.query(createNewUser)
//     .then((data) => res.status(201).json(data.rows))
//     .catch((e) => res.status(500).send(e.message));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
