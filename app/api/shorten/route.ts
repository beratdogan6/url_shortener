import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Schema, model, models } from "mongoose";
import { connectDB } from "@/lib/mongodb";

const UrlSchema = new Schema({
  id: String,
  url: String,
});

const Url = models.Url || model("Url", UrlSchema);

export async function POST(req: NextRequest) {
  await connectDB();

  const { url } = await req.json();
  const id = nanoid(6);

  await Url.create({ id, url });

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${id}`;
  return NextResponse.json({ shortUrl });
}

export async function GET() {
  await connectDB();

  const urls = await Url.find().sort({ date: -1 });
  return NextResponse.json({ urls });
}
