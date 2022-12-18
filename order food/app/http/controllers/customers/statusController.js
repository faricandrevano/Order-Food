const Order = require('../../../models/orders')

function statusController() {
    return {
        update(req, res) {
            Order.updateOne({_id: req.body.idUser}, { status: req.body.idOrder }, (err, data)=> {
                if(err) {
                    return res.redirect('/customer/orders')
                }
                console.log(req.body.idOrder)
                console.log(req.body.idUser)
                // Emit event 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/customer/orders')
            })
        }
    }
}

module.exports = statusController;