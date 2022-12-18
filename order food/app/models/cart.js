var Decimal = require('decimal');

module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
    // Quantity
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;
  
  this.add = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0
      };
    }
    storedItem.qty++;
    storedItem.price = Decimal(storedItem.item.price).mul(storedItem.qty).toNumber();
    this.totalQty++;
    this.totalPrice = Decimal(this.totalPrice).add(storedItem.item.price).toNumber();
  };
  
  this.reduceByOne = function(id) {
    this.items[id].qty--;
    this.items[id].price = Decimal(this.items[id].price).sub(this.items[id].item.price).toNumber();
    this.totalQty--;
    this.totalPrice = Decimal(this.totalPrice).sub(this.items[id].item.price).toNumber();
    
    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };
  
  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice = Decimal(this.totalPrice).sub(this.items[id].price).toNumber();
    delete this.items[id];
  };
  
  this.generateArray = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};