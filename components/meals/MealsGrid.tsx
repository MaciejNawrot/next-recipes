import classes from './MealsGrid.module.css';
import MealItem from "@/components/meals/MealItem";
import { Meal } from "@/types/Meal";

type MealsGridProps = {
  meals: Meal[];
}


export default function MealsGrid({ meals }: MealsGridProps) {

  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  )
}