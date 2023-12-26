// const { MongoClient } = require("mongodb");
import { connectionString } from "@/utils/constants";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
// Replace the uri string with your connection string.
const uri = connectionString;

// async function run() {

// }
// run().catch(console.dir);

export async function GET(request) {
  const client = new MongoClient(uri);
  try {
    const database = client.db("nextinventory");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const inventoryItem = await inventory.find(query).toArray();

    console.log(inventoryItem);
    return NextResponse.json({
      Data: inventoryItem,
      Message: "Successful",
      Status: true,
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
