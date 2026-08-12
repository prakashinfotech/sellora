# Prompt Engineering Techniques — Examples

All examples below use the Sellora marketplace app context so they're directly relevant to this project.

---

## 1. Zero-Shot

No examples given — just a direct instruction.

**Prompt:**
```
Write a short product description for a second-hand Sony headphone listed on an online marketplace.
```

**When to use:** Simple, well-understood tasks where the model already knows the format.

---

## 2. Few-Shot

Teach the model a pattern by giving examples before the actual request.

**Prompt:**
```
Convert ad titles to a clean, SEO-friendly format.

Input: "iphone 13 pro max 256gb like new!!"
Output: "iPhone 13 Pro Max 256GB – Like New"

Input: "selling my old sofa very cheap"
Output: "Second-Hand Sofa – Selling Cheap"

Input: "honda city 2019 model low km driven"
Output:
```

**When to use:** Formatting, classification, transformation tasks where the pattern matters.

---

## 3. Chain of Thought (CoT)

Ask the model to reason before answering.

**Prompt:**
```
A seller posted an ad at ₹45,000. The platform charges 3% commission on sales above ₹10,000 and 1.5% on sales below.
The buyer offered ₹42,000.
Think step by step: if the seller accepts, how much does the seller actually receive?
```

**When to use:** Math, logic, multi-step decisions. Reduces errors on complex reasoning.

---

## 4. Role / Persona

Give the model a role to set expertise and tone.

**Prompt:**
```
You are a senior NestJS backend developer with 8 years of experience.
Review this service method for security issues and suggest improvements:

async getThread(userId: number, otherUserId: number, adId: number) {
  return this.messageModel.findAll({
    where: { adId, senderId: userId, receiverId: otherUserId }
  });
}
```

**When to use:** Code review, architecture advice, debugging — any task where expertise matters.

---

## 5. Instruction + Context + Output Format

Structure your prompt into clear sections.

**Prompt:**
```
## Task
Write a push notification message for a buyer.

## Context
- The buyer messaged a seller about a "2019 Honda City"
- The seller just replied
- Platform name: Sellora
- Tone: friendly, concise

## Output Format
- Title: max 5 words
- Body: max 15 words
- No emojis
```

**When to use:** Any generation task where you need precise control over the result.

---

## 6. Constraints

Set explicit rules and limits.

**Prompt:**
```
Explain how JWT authentication works.
Rules:
- Max 4 bullet points
- Each bullet max 20 words
- No technical jargon
- Audience: a non-developer product manager
```

**When to use:** Documentation, explanations for mixed audiences, keeping outputs short.

---

## 7. Self-Consistency

Ask for multiple solutions, then pick the most common / best.

**Prompt:**
```
I need to model "conversations" between buyers and sellers in PostgreSQL.
Give me 3 different database schema approaches.
After listing all 3, recommend which is best for a Sellora-style marketplace app with high read volume.
```

**When to use:** Architecture decisions, complex problems where one approach might be wrong.

---

## 8. ReAct (Reason + Act)

The model reasons, acts, observes, then reasons again. Foundation of AI agents.

**Prompt:**
```
You are an agent with access to a database query tool.
Answer: "How many ads were posted in Mumbai in the last 7 days?"

Use this loop:
Thought: [what you need to do]
Action: [SQL query or tool call]
Observation: [result]
... repeat ...
Final Answer: [your answer]
```

**Example agent trace:**
```
Thought: I need to count ads where city = 'Mumbai' and createdAt >= 7 days ago.
Action: SELECT COUNT(*) FROM ads WHERE city = 'Mumbai' AND createdAt >= NOW() - INTERVAL '7 days';
Observation: COUNT = 143
Final Answer: 143 ads were posted in Mumbai in the last 7 days.
```

**When to use:** Building agents that use tools (database, APIs, file system).

---

## 9. Tree of Thought

Explore multiple reasoning branches before deciding. Good for design decisions.

**Prompt:**
```
I need to implement real-time chat for Sellora, a marketplace app.
Explore 3 different approaches:
  A) WebSocket (Socket.io)
  B) Server-Sent Events (SSE)
  C) Long Polling

For each:
- List 2 pros and 2 cons
- Rate suitability for a marketplace chat (1–10)

Then recommend one with justification.
```

**When to use:** Architecture choices, trade-off analysis, when you're unsure which approach to take.

---

## 10. Output Priming

Start the output yourself to lock in the format.

**Prompt:**
```
Generate a JSON object for a new ad listing. Start with:

{
  "id": 1,
  "title":
```

**When to use:** Forcing a specific structure (JSON, XML, CSV) when the model tends to add extra explanation.

---

## Combining Techniques (Real Example)

Most powerful prompts combine multiple techniques.

**Prompt:**
```
## Role
You are a code reviewer specializing in Node.js security.

## Task
Review the following NestJS controller endpoint and find vulnerabilities.

## Code
@Get('ads')
async search(@Query('q') q: string) {
  return this.db.query(`SELECT * FROM ads WHERE title LIKE '%${q}%'`);
}

## Instructions
- Think step by step (Chain of Thought)
- List each vulnerability found
- For each: explain the risk and provide a fixed code snippet
- Max 3 vulnerabilities

## Output Format
### Vulnerability 1: [Name]
**Risk:** ...
**Fix:**
\`\`\`typescript
// fixed code
\`\`\`
```

---

## Quick Reference Card

| Technique         | Best For                              | Key Phrase                        |
|-------------------|---------------------------------------|-----------------------------------|
| Zero-Shot         | Simple, clear tasks                   | Just ask directly                 |
| Few-Shot          | Pattern/format tasks                  | "Here are examples..."            |
| Chain of Thought  | Math, logic, multi-step               | "Think step by step"              |
| Role/Persona      | Expertise-dependent tasks             | "You are a senior..."             |
| Instruction+Format| Structured generation                 | Task / Context / Format sections  |
| Constraints       | Keeping output tight                  | "Max X words, no Y"               |
| Self-Consistency  | Architecture, decisions               | "Give 3 approaches, then pick"    |
| ReAct             | AI agents with tools                  | Thought / Action / Observation    |
| Tree of Thought   | Complex trade-off analysis            | "Explore N options, then decide"  |
| Output Priming    | Forcing exact format                  | Start the output yourself         |
