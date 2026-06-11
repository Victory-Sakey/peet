import { NextResponse } from "next/server";
import { Opportunity } from "@/context/AppContext";
import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

// Mock Opportunities Database in case API credentials are missing or for non-job listings
const mockOpportunitiesDb: Opportunity[] = [];

async function fetchJoobleJobs(keyword: string, location: string, category: string, apiKey: string): Promise<Opportunity[]> {
  try {
    const url = `https://jooble.org/api/${apiKey}`;
    const payload = {
      keywords: keyword ? `${keyword} ${category !== "All" ? category : ""}`.trim() : (category !== "All" ? category : "Software Developer"),
      location: location || "",
      ResultOnPage: 8
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.warn(`Jooble API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    return data.jobs.map((item: any) => {
      const titleClean = (item.title || "").replace(/<\/?[^>]+(>|$)/g, "");
      const descClean = (item.snippet || "").replace(/<\/?[^>]+(>|$)/g, "");

      let logo = "briefcase";
      const titleLower = titleClean.toLowerCase();
      if (titleLower.includes("react") || titleLower.includes("frontend") || titleLower.includes("web")) logo = "code";
      else if (titleLower.includes("ai") || titleLower.includes("nlp") || titleLower.includes("intelligence") || titleLower.includes("learning")) logo = "brain";
      else if (titleLower.includes("design") || titleLower.includes("ux") || titleLower.includes("ui") || titleLower.includes("figma")) logo = "palette";

      // Parse salary
      let salary = item.salary || "Salary Undisclosed";
      let salaryNum = 75000;
      if (item.salary) {
        const matches = item.salary.match(/\d+/g);
        if (matches && matches.length > 0) {
          salaryNum = parseInt(matches[0]);
        }
      }

      const skills: string[] = [];
      const testSkills = ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Figma", "UI Design", "Python", "PyTorch", "Transformers", "NLP", "Machine Learning", "AWS", "Docker", "Kubernetes", "CI/CD", "SEO", "Google Analytics", "Copywriting"];
      testSkills.forEach((skill) => {
        if (descClean.toLowerCase().includes(skill.toLowerCase()) || titleClean.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
      if (skills.length === 0) {
        skills.push("Software Engineering", "Problem Solving");
      }

      return {
        id: `jooble-${item.id}`,
        title: titleClean,
        provider: item.company || "Confidential Employer",
        logo,
        location: item.location || "Remote",
        salaryOrCost: salary,
        salaryNum,
        category: category !== "All" ? category : "Software Development",
        type: "job",
        subType: item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : "Full-time",
        description: descClean,
        requirements: [
          "Demonstrated proficiency in technologies matching core description.",
          "Excellent analytical and problem solving credentials.",
          "Strong communication and cooperative team spirit."
        ],
        skills,
        datePosted: item.updated ? item.updated.split("T")[0] : new Date().toISOString().split("T")[0],
        applicationLink: item.link || "https://jooble.org",
        analytics: { views: Math.floor(Math.random() * 200) + 10, clicks: Math.floor(Math.random() * 40) }
      };
    });
  } catch (error) {
    console.error("Jooble API error:", error);
    return [];
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

async function fetchYoutubeCourses(keyword: string, category: string, apiKey: string): Promise<Opportunity[]> {
  try {
    const queryTerm = keyword ? `${keyword} ${category !== "All" ? category : ""}`.trim() : (category !== "All" ? category : "Software Development");
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(queryTerm + " tutorial course")}&type=video&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`YouTube API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data || !data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((item: any) => {
      const rawTitle = item.snippet.title || "";
      const rawDescription = item.snippet.description || "";
      const title = decodeHtmlEntities(rawTitle);
      const description = decodeHtmlEntities(rawDescription);

      const channelTitle = item.snippet.channelTitle || "YouTube Creator";
      const videoId = item.id.videoId;

      // Dynamic type tagging: mark as training if it represents a bootcamp/full course
      const isTraining = title.toLowerCase().includes("bootcamp") || description.toLowerCase().includes("bootcamp") || title.toLowerCase().includes("training") || title.toLowerCase().includes("full course");
      const oppType = isTraining ? "training" : "education";
      const oppSubType = isTraining ? "Bootcamp" : "Course";

      let logo = "tv";
      if (title.toLowerCase().includes("react") || title.toLowerCase().includes("frontend") || title.toLowerCase().includes("web")) logo = "code";
      else if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("nlp") || title.toLowerCase().includes("intelligence") || title.toLowerCase().includes("learning")) logo = "brain";
      else if (title.toLowerCase().includes("design") || title.toLowerCase().includes("ux") || title.toLowerCase().includes("ui") || title.toLowerCase().includes("figma")) logo = "palette";

      const skills: string[] = [];
      const testSkills = ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Figma", "UI Design", "Python", "PyTorch", "Transformers", "NLP", "Machine Learning", "AWS", "Docker", "Kubernetes", "CI/CD", "SEO", "Google Analytics", "Copywriting"];
      testSkills.forEach((skill) => {
        if (description.toLowerCase().includes(skill.toLowerCase()) || title.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
      if (skills.length === 0) {
        skills.push("Development Skills", "Industry Best Practices");
      }

      return {
        id: `youtube-${videoId}`,
        title,
        provider: channelTitle,
        logo,
        location: "Remote",
        salaryOrCost: "Free",
        salaryNum: 0,
        category: category !== "All" ? category : "Software Development",
        type: oppType,
        subType: oppSubType,
        description,
        requirements: [
          "Requires internet access to stream video content.",
          "Self-paced learning structure. No registration or prerequisites required."
        ],
        skills,
        datePosted: item.snippet.publishedAt ? item.snippet.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        applicationLink: `https://www.youtube.com/watch?v=${videoId}`,
        isFree: true,
        isBeginnerFriendly: true,
        hasCertificate: false,
        analytics: { views: Math.floor(Math.random() * 800) + 100, clicks: Math.floor(Math.random() * 150) }
      };
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "All";
  
  // Custom boolean/type filters
  const typeParam = searchParams.get("type") || ""; // e.g. "job,education,training"
  const isFree = searchParams.get("isFree") === "true";
  const isBeginnerFriendly = searchParams.get("isBeginnerFriendly") === "true";
  const hasCertificate = searchParams.get("hasCertificate") === "true";

  const requestedTypes = typeParam ? typeParam.split(",") : ["job", "education", "training"];

  const joobleApiKey = process.env.JOOBLE_API_KEY;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  let apiJobs: Opportunity[] = [];
  let apiEducation: Opportunity[] = [];

  const useJooble = joobleApiKey && joobleApiKey !== "YOUR_JOOBLE_API_KEY";
  const useYoutube = youtubeApiKey && youtubeApiKey !== "YOUR_YOUTUBE_API_KEY";

  // 1. Fetch live jobs from Jooble if requested & key available
  if (requestedTypes.includes("job") && useJooble) {
    apiJobs = await fetchJoobleJobs(keyword, location, category, joobleApiKey);
  }

  // 2. Fetch live education/training from YouTube if requested & credentials available
  if ((requestedTypes.includes("education") || requestedTypes.includes("training")) && useYoutube) {
    const youtubeResults = await fetchYoutubeCourses(keyword, category, youtubeApiKey);
    apiEducation = youtubeResults.filter((opp) => requestedTypes.includes(opp.type));
  }

  // 3. Fetch from local database (which acts as a fallback for jobs, and primary for training/education)
  let localOpps: Opportunity[] = [];
  if (isConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "opportunities"));
      querySnapshot.forEach((docSnap) => {
        localOpps.push(docSnap.data() as Opportunity);
      });
    } catch (e) {
      console.error("Error fetching from Firestore, falling back to memory db:", e);
      localOpps = mockOpportunitiesDb;
    }
  } else {
    localOpps = mockOpportunitiesDb;
  }

  const filteredLocal = localOpps.filter((opp) => {
    // Type check
    if (!requestedTypes.includes(opp.type)) return false;

    // Search keyword check
    const matchKeyword =
      !keyword ||
      opp.title.toLowerCase().includes(keyword.toLowerCase()) ||
      opp.provider.toLowerCase().includes(keyword.toLowerCase()) ||
      opp.description.toLowerCase().includes(keyword.toLowerCase());

    // Location check
    const matchLocation = !location || opp.location.toLowerCase().includes(location.toLowerCase());

    // Category check
    const matchCategory = category === "All" || opp.category === category;

    // Free filter
    if (isFree && opp.type !== "job" && !opp.isFree) return false;

    // Beginner friendly filter
    if (isBeginnerFriendly && opp.type !== "job" && !opp.isBeginnerFriendly) return false;

    // Certificate filter
    if (hasCertificate && opp.type !== "job" && !opp.hasCertificate) return false;

    return matchKeyword && matchLocation && matchCategory;
  });

  // Combine results
  let finalJobs: Opportunity[] = [];
  if (requestedTypes.includes("job")) {
    const localJobs = filteredLocal.filter((opp) => opp.type === "job");
    if (useJooble && apiJobs.length > 0) {
      finalJobs = [...localJobs, ...apiJobs];
    } else {
      finalJobs = localJobs;
    }
  }

  let finalEducation: Opportunity[] = [];
  if (requestedTypes.includes("education") || requestedTypes.includes("training")) {
    if (useYoutube && apiEducation.length > 0) {
      const localEduTraining = filteredLocal.filter((opp) => opp.type === "education" || opp.type === "training");
      finalEducation = [...apiEducation, ...localEduTraining];
    } else {
      finalEducation = filteredLocal.filter((opp) => opp.type === "education" || opp.type === "training");
    }
  }

  // Merge everything
  let finalResults = [...finalJobs, ...finalEducation];

  // Apply filters to the combined list (especially important for API items)
  finalResults = finalResults.filter((opp) => {
    if (opp.type === "job") return true;
    
    if (isFree && !opp.isFree) return false;
    if (isBeginnerFriendly && !opp.isBeginnerFriendly) return false;
    if (hasCertificate && !opp.hasCertificate) return false;
    
    return true;
  });

  // Sort by datePosted desc
  finalResults.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());

  return NextResponse.json({ results: finalResults });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `opp-${Date.now()}`;
    const newOpp: Opportunity = {
      ...body,
      id,
      datePosted: new Date().toISOString().split("T")[0],
      analytics: { views: 1, clicks: 0 }
    };

    if (isConfigured && db) {
      await setDoc(doc(db, "opportunities", id), newOpp);
    } else {
      mockOpportunitiesDb.unshift(newOpp);
    }

    return NextResponse.json({ success: true, opportunity: newOpp });
  } catch (error) {
    console.error("Post opportunity error:", error);
    return NextResponse.json({ error: "Failed to post opportunity" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    if (isConfigured && db) {
      await deleteDoc(doc(db, "opportunities", id));
    } else {
      const index = mockOpportunitiesDb.findIndex((opp) => opp.id === id);
      if (index !== -1) {
        mockOpportunitiesDb.splice(index, 1);
      } else {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete opportunity error:", error);
    return NextResponse.json({ error: "Failed to delete opportunity" }, { status: 500 });
  }
}

