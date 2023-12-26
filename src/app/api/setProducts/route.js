import { connectionString } from "@/utils/constants";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
const uri = connectionString;
const errorObj = {
  Data: null,
  Message: "Something is wrong",
  Status: false,
};
export async function POST(request) {
  const client = new MongoClient(uri);
  console.log(request);
  try {
    let body = await request.json();
    if (body.name && body.price && body.qty) {
      const database = client.db("nextinventory");
      const inventory = database.collection("inventory");
      const response = await inventory.insertOne(body);
      if (response.acknowledged) {
        return NextResponse.json({
          Data: null,
          Message: "Data insert successful",
          Status: true,
        });
      } else {
        return NextResponse.json(errorObj);
      }
    } else {
      return NextResponse.json({
        ...errorObj,
        Message: "All fields are required",
      });
    }
  } finally {
    await client.close();
  }
}
