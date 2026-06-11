import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { seekerProfile, cvEducation, cvDegree, cvIntro } = await req.json();

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

    const prompt = `Create a high-quality, professional, ATS-optimized resume in clean Markdown format for the following user profile:

Name: ${seekerProfile.name}
Title: ${seekerProfile.title}
Email: ${seekerProfile.email}
Phone: ${seekerProfile.phone}
Date Generated: ${currentDate}

Biography/Summary:
${cvIntro}

Education:
- Institution: ${cvEducation}
- Degree: ${cvDegree}

Skills:
${seekerProfile.skills.join(", ")}

Work Experience:
${seekerProfile.experience
  .map(
    (exp: any) => `- Role: ${exp.role} at ${exp.company} (${exp.duration})
  Description: ${exp.description}`
  )
  .join("\n")}

Format this nicely with clear headers. Include the Date Generated (${currentDate}) at either the top or bottom of the CV. Output ONLY the raw Markdown code. Do not include markdown code block backticks (\`\`\`) in your output. Just output the content directly starting from the name title header.`;

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
            content: "You are an expert ATS CV builder that creates elegant resumes in markdown."
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
      console.error("OpenRouter CV API error:", errorText);
      return NextResponse.json(
        { success: false, error: `OpenRouter returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const cv = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, cv });
  } catch (error: any) {
    console.error("CV API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
