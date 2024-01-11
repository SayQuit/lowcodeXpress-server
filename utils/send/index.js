function sendFail(res) {
    res.send({
        msg: 'fail',
        status: 200,
    })
}

function sendData(res,data) {
    res.send({
        msg: 'sucesss',
        status: 200,
        data
    })
}

module.exports = { sendData, sendFail }