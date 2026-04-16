 const successresponse = (
    {
        res,
        status = 200,
        message = "done",
        data = undefined
    } = {}) => {
    return res.status(status).json({ message })
}
export default successresponse;