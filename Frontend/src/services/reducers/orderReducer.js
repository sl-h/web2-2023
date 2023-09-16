import {
    ADD_ITEM_TO_CART,
    BUY_ITEMS_FAIL,
    BUY_ITEMS_REQUEST,
    BUY_ITEMS_SUCCESS, CANCEL_PURCHASE_FAIL,
    CANCEL_PURCHASE_REQUEST, CANCEL_PURCHASE_SUCCESS,
    cenaDostave,
    DELETE_ORDER,
    GET_ALL_ORDERS_FAIL,
    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    MAKE_ORDER,
    REMOVE_ITEM_FROM_CART
} from "../constants/orderConstants";

export const getOrdersReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_ORDERS_REQUEST:
            return {  };
        case GET_ALL_ORDERS_SUCCESS:
            return {success: true, orders: action.payload};
        case GET_ALL_ORDERS_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const deleteOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case CANCEL_PURCHASE_REQUEST:
            return {  };
        case CANCEL_PURCHASE_SUCCESS:
            return {success: true, };
        case CANCEL_PURCHASE_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};



const persistedState = JSON.parse(localStorage.getItem('cart'))
const initalState =  {
    totalAmount: 0,
    orderItems: [],
}



export const cartReducer = (state = persistedState || initalState, action) => {


    switch (action.type) {
        case ADD_ITEM_TO_CART:
                const existingItem = state.orderItems.find(item => item.articleId == action.payload.articleId)

                if(existingItem) {
                    const updatedOrderItems = state.orderItems.map(item =>
                        item.articleId == existingItem.articleId
                            ? {...item, quantity: ++item.quantity}
                            : item);

                    const updatedTotalAmount = state.totalAmount + action.payload.price

                    return {
                        ...state,
                        orderItems: updatedOrderItems,
                        totalAmount: updatedTotalAmount
                    }
                }
                else {
                    const updatedOrderItems = [...state.orderItems, {...action.payload, quantity: 1}];
                    const updatedTotalAmount = state.totalAmount + action.payload.price;
                    return {
                        ...state,
                        orderItems: updatedOrderItems,
                        totalAmount: updatedTotalAmount
                    }
                }
                console.log(action.payload)
               

        case REMOVE_ITEM_FROM_CART:
              const existingItem2 = state.orderItems.find(item => item.articleId == action.payload.articleId)

              if(existingItem2 && existingItem2.quantity > 0){
                  const updatedItems2 = state.orderItems.map(item => item.articleId == existingItem2.articleId ? {...item, quantity: item.quantity-1}: item)
                  const totalAmount2 = state.totalAmount - existingItem2.price
                 return {
                  ...state,
                  orderItems: updatedItems2,
                  totalAmount: totalAmount2
                  }

              }
              else
              {
                  return {
                ...state,
                orderItems: state.orderItems.filter(item => item.articleId != action.payload.articleId),
                totalAmount: state.totalAmount - action.payload.price
            }
        }

        case DELETE_ORDER:
            return {
                ...initalState
            }

        case  BUY_ITEMS_REQUEST:
            return { ...state};

        case BUY_ITEMS_SUCCESS:
            return {...initalState};

        case BUY_ITEMS_FAIL:
            console.log('BUY ITEMS FAILS')
            return {...state};



        default:
            return state
    }
}


