"use server";

import { Meal } from "@/types/Meal";
import { saveMeal } from "@/lib/meals";
import { redirect } from "next/navigation";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const mealSchema = z.object({
  title: z.string().min(1, "Title is required."),
  summary: z.string().min(1, "Summary is required."),
  instructions: z.string().min(1, "Instructions are required."),
  creator: z.string().min(1, "Creator name is required."),
  creator_email: z.string().min(1, "Email is required.").email("Invalid email format."),
  image: z.instanceof(File, { message: "Image file is required." }), // Ensure image is a file
});

export async function shareMeal(
  prevState: { message: string }, // Ensure the state structure is correct
  formData: FormData
) {
  const meal = {
    title: formData.get("title")?.toString() || "",
    summary: formData.get("summary")?.toString() || "",
    instructions: formData.get("instructions")?.toString() || "",
    creator: formData.get("name")?.toString() || "",
    creator_email: formData.get("email")?.toString() || "",
    image: formData.get("image"),
  } as Meal;

  const parsedMeal = mealSchema.safeParse(meal);
  if (!parsedMeal.success) {
    return { message: "Invalid form data" };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}