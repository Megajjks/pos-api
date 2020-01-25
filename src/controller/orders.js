const randomId = require('random-id');

const {
  selectAllOrders,
  selectDataOrder,
  insertDataOrder,
  updateDataOrder,
  deleteDataOrder,
  
  selectAllOrderItems,
  selectDataOrderItem,
  insertDataOrderItem,
  // updateDataOrderItem,
  deleteDataOrderItem,
  // sumDataOrderItems,
  
  // selectAllOrderPayments,
  // selectDataOrderPayment,
  // insertDataOrderPayment,
  // updateDataOrderPayment,
  // deleteDataOrderPayment
} = require('../models/orders');

const {
  selectProductPrice
} = require('../models/products');

const {
  jsonResponse,
  jsonError,
  errorBadRequest
} = require('../helper');

const getAllOrders = async (req, res) => {
  const urlQueries = req.query;
  const result = await selectAllOrders(urlQueries);
  return jsonResponse(res, result);
};

const getOrder = async (req, res) => {
  const { id } = req.params;
  const result = await selectDataOrder(id);
  return jsonResponse(res, result);
};

const postOrder = async (req, res) => {
  try {
    const { user_id, orders } = req.body;
    orders.map(order => {
      const { product_id, quantity } = order;
      if(!product_id || !quantity) {
        return jsonError(res, errorBadRequest);
      }
      if(quantity < 1) {
        return jsonError(res, errorBadRequest);
      }
      if(!res.body && !user_id || !orders) {
        return jsonError(res, errorBadRequest);
      }
    });
    const dataOrders = {
      user_id,
      reference: randomId(8, '0')
    };
    const insertOrder = await insertDataOrder(dataOrders);
    const id = insertOrder ? insertOrder.insertId : '';
    let dataOrderDetails = [];
    let total = 0;
    Promise.all(orders.map(async order => {
      const { product_id, quantity } = order;
      const selectPrice = await selectProductPrice(product_id);
      const { price } = selectPrice;
      const subtotal = quantity * price;
      total += subtotal;
      const items = {
        order_id: id,
        product_id,
        quantity,
        price,
        subtotal
      };
      await insertDataOrderItem(items);
      dataOrderDetails.push(items);
    })).then(async () => {
      const result = {
        id,
        ...dataOrders,
        total,
        orders: dataOrderDetails
      };
      await updateDataOrder({ total }, id);
      console.log(result);
      return jsonResponse(res, result);
    }).catch(error => {
      throw new Error(error);
    });
  } catch(error) {
    return jsonError(res, errorBadRequest);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDataOrderItem(id);
    await deleteDataOrder(id);
    const result = {
      id
    };
    return jsonResponse(res, result);
  } catch(error) {
    return jsonError(res, errorBadRequest);
  }
};

const getAllOrderItems = async (req, res) => {
  let urlQueries = req.query;
  urlQueries.order_id = req.params.id;
  const result = await selectAllOrderItems(urlQueries);
  return jsonResponse(res, result);
};

const getOrderItem = async (req, res) => {
  const { id } = req.params;
  const result = await selectDataOrderItem(id);
  return jsonResponse(res, result);
};

// const postOrderItem = async (req, res) => {
// };

// const putOrderItem = async (req, res) => {
// };

// const deleteOrderItem = async (req, res) => {
// };

// const getAllOrderPayments = async (req, res) => {
// };

// const getOrderPayment = async (req, res) => {
// };

// const postOrderPayment = async (req, res) => {
// };

// const putOrderPayment = async (req, res) => {
// };

// const deleteOrderPayment = async (req, res) => {
// };

module.exports = {
  getAllOrders,
  getOrder,
  postOrder,
  // putOrder,
  deleteOrder,
  
  getAllOrderItems,
  getOrderItem,
  // postOrderItem,
  // putOrderItem,
  // deleteOrderItem,

  // getAllOrderPayments,
  // getOrderPayment,
  // postOrderPayment,
  // putOrderPayment,
  // deleteOrderPayment
};
