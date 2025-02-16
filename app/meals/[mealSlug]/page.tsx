import classes from './page.module.css';
import Image from "next/image";
import { getMealBySlug } from "@/lib/meals";
import { notFound } from "next/navigation";

type MealsSlugPageParams = {
  params: Promise<{
    mealSlug: string;
  }>;
}

export async function generateMetadata({ params }: MealsSlugPageParams) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealsDetailsPage({ params }: MealsSlugPageParams) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);

  if (!meal) {
    notFound();
  }
  const mealInstructions = meal.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}> {meal.creator} </a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p className={classes.instructions} dangerouslySetInnerHTML={{
          __html: mealInstructions
        }}></p>
      </main>
    </>
  );
}