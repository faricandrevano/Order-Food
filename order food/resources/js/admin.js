import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'

const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
}

export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTabelBody')
    var orders = []
    var markup;

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return Array.from(parsedItems).map((menuItem) => {
            return `
                <p class="mb-4">${ menuItem.item.name }</p>
            `
        }).join('')
      }
      function renderItemsQty(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p class="mb-4">${ menuItem.qty}</p>
            `
        }).join('')
      }

      function renderPrice(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p class="mb-4">${ menuItem.item.price}</p>
            `
        }).join('')
      }
      function renderImage(items) {
        let parsedItems = Object.values(items);
        return parsedItems.map((menuImage)=> {
            return `<img src="${menuImage.item.image}" width="30" class="block mb-4">`;
        }).join('')
      }
    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <div>
                        <div class="flex justify-around items-center">
                            <span class="block">${renderImage(order.items)}</span>
                            <span class="block">${renderItems(order.items)}</span>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">${renderItemsQty(order.items)}</td>
                <td class="border px-4 py-2">${ renderPrice(order.items)}</td>
                <td class="border px-4 py-2">${ order.customerId.name }</td>
                <td class="border px-4 py-2">${ order.adress }</td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('LLLL') }
                </td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="on-proses"
                                    ${ order.status === 'on-proses' ? 'selected' : '' }>
                                    on-proses</option>
                                <option class="opsiComplete" value="complete" ${ order.status === 'complete' ? 'selected' : '' }>
                                    complete</option>
                            </select>
                        </form>
                    </div>
                </td>
            </tr>
        `
        }).join('')
    }
    // Socket

// let socket = io()

    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'order ditambahkan!',
            theme: 'metroui',
            progressBar: false,
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })
 }


                //  <td class="border px-4 py-2">
                //     ${ order.paymentType ? 'paid' : 'Not paid' }
                // </td>