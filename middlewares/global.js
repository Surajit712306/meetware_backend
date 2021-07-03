
const errorHandler = (err, req, res, next) => {
    res.status(res.statusCode !== 200 ? res.statusCode : 500);
    return res.json({ 
        type: "ERROR",
        payload: `${err.message}`,
    });    
}

const notFound = (req, res, next) => {
    res.status(404);
    return res.json({
        type: "ERROR",
        payload: "Resource is not found."
    });
}

module.exports = {errorHandler, notFound};