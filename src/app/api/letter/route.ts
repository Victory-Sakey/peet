import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seekerProfile, letterJobTitle, letterCompany, letterTone } = await req.json();

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "OpenRouter API Key is not configured in .env.local" 
        }, 
        { status: 500 }
      );
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const prompt = `Write a high-quality, professional cover letter for the following candidate applying for a job:

Candidate Name: ${seekerProfile.name}
Candidate Title: ${seekerProfile.title}
Email: ${seekerProfile.email}
Phone: ${seekerProfile.phone}
Date: ${currentDate}
Target Position: ${letterJobTitle}
Target Company: ${letterCompany}
Tone/Style: ${letterTone}

Candidate Core Skills:
${seekerProfile.skills.join(", ")}

Candidate Work Experience:
${seekerProfile.experience
  .map(
    (exp: any) => `- Role: ${exp.role} at ${exp.company} (${exp.duration})
  Description: ${exp.description}`
  )
  .join("\n")}

Format this cover letter beautifully as a standard formal letter. Include sender block details, date (${currentDate}), receiver placeholder, subject line, and signature block. Do not include markdown code block backticks (\`\`\`) in your output. Just output the content directly starting from the sender header details.`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://peet.com",
        "X-Title": "PEET AI Career Suite",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional cover letter writer that creates high-converting job application letters."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Letter API error:", errorText);
      return NextResponse.json(
        { success: false, error: `OpenRouter returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const letter = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, letter });
  } catch (error: any) {
    console.error("Letter API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
