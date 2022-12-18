import axios from 'axios';
import Noty from 'noty';
import {
    initAdmin
} from './admin'
import moment from 'moment';
import { initStripe } from './stripe'


let addToCart = document.querySelectorAll('.add-to-cart');
let cartCount = document.querySelector('#cartCount');
let btnRemove = document.querySelectorAll('#btnRemove');
let btnRegister = document.querySelector('#btnRegister');
const fileInput = document.querySelector('input[type="file"]');

// const valueInput = document.querySelector('.valueInput');
//         const File = new File(['halloooo'],valueInput.dataset.foto,{
//             lastModified: new Date(),
//             type: 'img'
//         })

//         const dataTransfer = new DataTransfer();
//         dataTransfer.items.add(File)
//         fileInput.files = dataTransfer.files;

// function updateCart(pizza) {
//     axios.post('/update-cart',{headers:{c}}, pizza[0]).then(function(res) {
//         console.log(pizza[0])
//         cartCount.innerText = res.data.totalQty
//         new Noty({
//             type: 'success',
//             timeout: 2100,
//             progressBar: false,
//             killer: false,
//             theme: 'metroui',
//             text: "item ditambahkan di keranjang"
//         }).show();
//     }).catch(err => {
//         new Noty({
//             type: 'error',
//             timeout: 2100,
//             progressBar: false,
//             theme: 'metroui',
//             text: 'gagal menambahkan item di keranjang'
//         }).show();
//     })
// }

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(function(res) {
        console.log(pizza)
        cartCount.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            killer: false,
            theme: 'metroui',
            text: "item ditambahkan di keranjang"
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 2100,
            progressBar: false,
            theme: 'metroui',
            text: 'gagal menambahkan item di keranjang'
        }).show();
    })
}


function removeItem(pizza) {
    axios.post('/remove-item',pizza).then(function(res) {
        // console.log(req.session.cart.item);
        // delete req.session.cart.item;
      new Noty({
            type: 'success',
            timeout: 2100,
            progressBar: false,
            killer: false,
            theme: 'metroui',
            text: "item berhasil dihapus"
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 2100,
            progressBar: false,
            theme: 'metroui',
            text: 'item gagal di hapus'
        }).show();  
    })
}

addToCart.forEach(function(event) {
        event.addEventListener('click', function(e) {
            let pizzas = JSON.parse(event.dataset.pizza);
            updateCart(pizzas)
        })
    })
btnRemove.forEach(function(event) {
    event.addEventListener('click',function(e) {
        let pizzas = JSON.parse(event.dataset.pizzaid);
        console.log(pizzas)
        removeItem(pizzas)
        // console.log(pizzas)
    })
})
// buang pesan alert setelah beberapa detik






const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 4000)
}

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

// const selesai = document.querySelectorAll('.selesai');
// const opsiComplete = document.querySelectorAll('.opsiComplete');

//     // var statusChange = document.querySelectorAll('.statusChange');
//     // var status = Array.prototype.slice.call(document.querySelectorAll('.action #status'));

  
//         var statusData = document.querySelectorAll('#status');
//     selesai.forEach((el,index)=>{
//         el.addEventListener('click',()=>{
//             statusData[index].innerHTML = 'complete'
//             el.disabled = true
//         })
//     })
//     statusData.forEach((el,index)=>{
//         if(el.innerHTML == "complete") {
//             selesai[index].disabled = true
//         } else if(el.innerHTML == "completed") {
//             selesai[index].disabled = true
//         }
//     })
    // const divssr = Array.from(status)
updateStatus(order);

initStripe()
// Socket
let socket = io();

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        killer: false,
        theme: 'metroui',
        text: 'Order updated',
        progressBar: false,
    }).show();
})
