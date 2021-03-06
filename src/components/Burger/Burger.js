import React from 'react';
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {

  // our props are an object, thus need some work before we can use them. Object.keys returns an array of keys from the object it's given.
  let transformedIngredients = Object.keys(props.ingredients)
  .map(igKey => {
    //this double map first returns an array of ingredients, then maps over that new array, duplicating items based on their quantity in state
    return [...Array(props.ingredients[igKey])].map((_, i)=> {
      return <BurgerIngredient key={igKey + Math.random()} type={igKey} />
    })
  }).reduce((arr, el) => {
    return arr.concat(el)
  }, []);
  if(transformedIngredients.length === 0){
      transformedIngredients = <p>Please start adding ingredients!</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
        {transformedIngredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
}

export default burger;
