import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { Meal } from "@/types/Meal";

const db = new sql('meals.db');

export async function getMeals(): Promise<Meal[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const stmt = db.prepare('SELECT * FROM meals');
  return stmt.all() as Meal[];
}

export async function getMealBySlug(slug: string): Promise<Meal> {
  const stmt = db.prepare('SELECT * FROM meals WHERE slug = ?');
  return stmt.get(slug) as Meal;
}

export async function saveMeal(meal: Meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const image = meal.image as unknown as File;

  const extention = image.name.split('.').pop();
  const filename = `${meal.slug}.${extention}`;

  const stream = fs.createWriteStream(`public/images/${filename}`);
  const bufferedImage = await image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Could not save image');
    }
  });

  meal.image = `/images/${filename}`;

  db.prepare(`
    INSERT INTO meals (title, image, summary, instructions, creator, creator_email, slug)
    VALUES (@title, @image, @summary, @instructions, @creator, @creator_email, @slug)
  `).run(meal);

}