import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Attach event listeners BEFORE connecting
    mongoose.connection.on('connected', () => {
      console.log("MongoDB connected (event)");
    });

    mongoose.connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully (await)");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
