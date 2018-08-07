import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false
  }

  updatePurchaseState (ingredients) {
    //making a copy of the state here caused problems because of the async nature, thus we are passing in the current state from the more and less buttons.

    // const ingredients = {
    //   ...this.state.ingredients
    // }

    const sum = Object.keys(ingredients)
    .map(igKey => {
      return ingredients[igKey];
    })
    .reduce((sum, el) => {
      return sum + el;
    }, 0)
    this.setState({purchaseable: sum > 0});
  }

//the type is comming from BuildControls.js. there we made a library object that contains a key = type, so we know what type of ingredient is being added/removed.
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true})
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler = () => {
    // alert('You continue!')
  //   this.setState({ loading: true })
  //   const order = {
  //     ingredients: this.state.ingredients,
  //     price: this.state.totalPrice,
  //     customer: {
  //       name: 'Test',
  //       address: {
  //         street: '1234 West',
  //         zipCode: '13590',
  //         country: 'USA'
  //       },
  //       email: 'test@test.com'
  //     },
  //     deliveryMethod: 'fastest'
  //   }
  //
  //   axios.post('/orders.json', order)
  //   .then( response => {
  //       this.setState({ loading: false, purchasing: false })
  //     })
  //   .catch(error => {
  //     console.log(error);
  //     this.setState({ loading: false, purchasing: false })
  //   })

      //here we'll pass on an array with the user picked ingredients
      const queryParams = []
      for(let i in this.state.ingredients){
        //encodeURIComponent is a JavaScript thing that encodes items to go through a URL. All the extra ?/= stuff is formatting the array for the URL. This is being done because the Checkout component is not connected to BurgerBuilder but needs the ingredients a user picked
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
      }
      const queryString = queryParams.join('&')
      this.props.history.push({
        pathname: '/checkout',
        search: '?' + queryString
      })
    }

  render() {
    const disableInfo = {
      ...this.state.ingredients
    }
    for (let key in disableInfo){
      disableInfo[key] = disableInfo[key] <= 0;
    }

    let orderSummary = <OrderSummary
      ingredients={this.state.ingredients}
      price={this.state.totalPrice}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}/>

    if (this.state.loading){
      orderSummary = <Spinner />
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>

        <Burger ingredients={this.state.ingredients}/>
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disableInfo}
          purchaseable={this.state.purchaseable}
          ordered={this.purchaseHandler}
          price={this.state.totalPrice}/>
      </Aux>
    );
  }

}

export default BurgerBuilder;
