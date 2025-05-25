const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    company: { type: String, required: true },
    contact_email: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    jobType: {
      type: String,
      enum: ["practice", "internship"],
      required: true,
      default: "practice"
    },
    // ... existing code ...
  }
); 