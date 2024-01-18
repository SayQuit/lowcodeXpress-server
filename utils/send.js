function sendFail(res) {
    return res.send({
        msg: 'fail',
        status: 200,
    })
}

function sendData(res,data) {
    return res.send({
        msg: 'success',
        status: 200,
        data
    })
}

module.exports = { sendData, sendFail }