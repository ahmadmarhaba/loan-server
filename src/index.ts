import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

if (!port) {
  console.error("[server]: Port is not set");
  process.exit(1);
}

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to enable CORS
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("[mongodb]: MONGODB_URI is not set");
  process.exit(1);
}

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    console.log("[mongodb]: Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("[mongodb]: Connected successfully");
  } catch (error) {
    console.error("[mongodb]: Initial connection failed", error);
    setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds if initial connection fails
  }
};
connectToMongoDB();
// Use `Schema.Types` to derive the type of the schema
type LoanType = mongoose.InferSchemaType<typeof loanSchema>;

const currency_enum = ["USD", "EUR", "GBP", "CAD"];

// Define a simple schema and model for demonstration
const loanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    match: [/^[a-zA-Z\s]{3,20}$/, "Name must be alphanumeric and between 3 to 20 characters"],
  },
  amount_gbp: { type: Number, required: [true, "amount_gbp is required"], min: 1 },
  amount_original: { type: Number, required: [true, "amount_original is required"], min: 1 },
  term: {
    type: Number,
    required: [true, "term is required"],
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer!",
    },
  },
  rate_used: { type: Number, required: [true, "rate_used is required"] },
  currency: { type: String, enum: currency_enum, required: [true, "currency is required"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Loan = mongoose.model("Loan", loanSchema);

// POST request to add an loan
app.post("/v1/loan", async (req: Request, res: Response) => {
  const { name, amount_gbp, amount_original, currency, term, rate_used } = req.body as LoanType;
  const newLoan = new Loan({ name, amount_gbp, amount_original, currency, term, rate_used });
  try {
    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    // Detailed error logging
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      console.error("[validation error]:", errorMessages); // Log validation error details for debugging
      res.status(400).json({ error: "Failed to save loan", details: errorMessages });
    } else {
      console.error("[server error]:", error); // Log the server-side error for debugging
      res.status(500).json({ error: "Failed to save loan", details: error });
    }
  }
});

// GET request to fetch all loans
app.get("/v1/loans", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const { amount_sort, term_sort, createdAt_sort } = params;
    let loans = [];
    if (amount_sort) {
      loans = await Loan.find().sort({ amount_gbp: amount_sort === "asc" ? 1 : -1 });
    } else if (term_sort) {
      loans = await Loan.find().sort({ term: term_sort === "asc" ? 1 : -1 });
    } else if (createdAt_sort) {
      loans = await Loan.find().sort({ createdAt: createdAt_sort === "asc" ? 1 : -1 });
    } else {
      loans = await Loan.find().sort({ createdAt: -1 });
    }
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loans" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Nodejs connected");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
