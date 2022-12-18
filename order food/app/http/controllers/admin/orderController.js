const Order = require('../../../models/orders')
const User = require('../../../models/user')
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../../../../helpers/options');
const data = require('../../../../helpers/data');

function orderController() {
    return {
        async index(req, res) {
            const user = await User.find({_id:req.user._id})
           Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).limit(5).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                // console.log(res.json(orders))
                // console.log(orders)
                return res.json(orders);   
               } else {
                return res.render('admin/orders',{title: 'admin page',page_name: 'order',user});
               }
           })
            res.header('Cache-Control', 'no-store')
        },
        async generatePdf(req,res,next) {
            const html = fs.readFileSync(path.join(__dirname, '../../../../resources/views/template.html'), 'utf-8');
            console.log(path.join(__dirname, '../../../../resources/views/template.html'))
            const filename = 'laporan' + '.pdf';
            let array = [];

            // data.forEach(d => {
            //     const prod = {
            //         name: d.name,
            //         description: d.description,
            //         unit: d.unit,
            //         quantity: d.quantity,
            //         price: d.price,
            //         total: d.quantity * d.price,
            //         imgurl: d.imgurl
            //     }
            //     array.push(prod);
            // });

            const dataOrder = await Order.find();
            dataOrder.forEach(el=>console.log(el.items))

            let subtotal = 0;
            array.forEach(i => {
                subtotal += i.total
            });
            const tax = (subtotal * 20) / 100;
            const grandtotal = subtotal - tax;
            const obj = {
                prodlist: array,
                subtotal: subtotal,
                tax: tax,
                gtotal: grandtotal
            }
            const document = {
                html: html,
                data: {
                    products: obj
                },
                path: './docs/' + filename
            }
            pdf.create(document, options)
                .then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
                const filepath = 'http://localhost:5000/docs/' + filename;

                res.render('admin/downloadReport', {
                    path: filepath,
                    title: 'admin_page'
                });
        }
    }
}

module.exports = orderController;