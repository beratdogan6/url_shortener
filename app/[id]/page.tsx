import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { model, models, Schema } from "mongoose";

const UrlSchema = new Schema({
  id: String,
  url: String,
});

const Url = models.Url || model("Url", UrlSchema);

type PageProps = {
  params: {
    id: string;
  };
};

export default async function RedirectPage({ params }: PageProps) {
  await connectDB();

  const result = await Url.findOne({ id: params.id });

  if (result) {
    redirect(result.url);
  } else {
    return <p>URL not found</p>;
  }
}
