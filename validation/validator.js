function checkParams(shema) {
    return (req, res, next) => {
        const validationResult = shema.validate(req.params);
        if (validationResult.error) {
            return res.status(400).send(validationResult.error.details);
        }
        next();
    }
}

function checkBody(shema) {
    return (req, res, next) => {
        const validationResult = shema.validate(req.body);
        if (validationResult.error) {
            return res.status(400).send(validationResult.error.details);
        }
        next();
    }
}

module.exports = {
    checkParams,
    checkBody
};