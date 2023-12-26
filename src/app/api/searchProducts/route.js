// const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017";

// async function run() {

// }
// run().catch(console.dir);

export async function GET(request) {
  const client = new MongoClient(uri);
  try {
    console.log(request.nextUrl.searchParams.get("query"), "payload");
    // const payload = await request.json();
    const query = request.nextUrl.searchParams.get("query");
    const database = client.db("nextinventory");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'

    // const inventoryItem = await inventory.find(payload).toArray();
    const inventoryItem = await inventory
      .aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { qty: { $regex: query, $options: "i" } },
              { price: { $regex: query, $options: "i" } },
            ],
          },
        },
      ])
      .toArray();

    // console.log(inventoryItem);
    return NextResponse.json(inventoryItem);
  } catch (e) {
    console.log(e.message, "error");
    return NextResponse.json({ Message: e.message });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
