

const authorization = (req, res, next) => {
    console.log("Received a request requiring authorization.");
    console.log({request: req})
    const tokenRaw = req.headers.authorization;
    //console.log(req.headers.authorization);
    const token = tokenRaw.split(" ")[1];
    console.log(`Checking user with auth token ${token}`);
    if (!token || token !== process.env.API_token) {
        return res.status(401).send("Unauthorized accesss");
    }
    next();
};

module.exports = authorization;