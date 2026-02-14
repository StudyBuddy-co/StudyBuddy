import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // only on server
);

const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY")!;
const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID")!;
const EDGE_SECRET = Deno.env.get("EDGE_SECRET")!;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://your-production-site.com",
];

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";

  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "http://localhost:5173",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const auth = req.headers.get("authorization");
    if (!auth || auth !== `Bearer ${EDGE_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: CORS_HEADERS });
    }

    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response(JSON.stringify({ error: "Missing record" }), { status: 400, headers: CORS_HEADERS });
    }

    // Look up user by email if not authenticated
    let userId = record.user_id;
    if (!userId && record.email) {
      const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
        .from("profile")
        .select("id")
        .eq("email", record.email)
        .single();

      console.log("Profile lookup result:", { existingProfile, profileLookupError });

      if (!profileLookupError && existingProfile) {
        userId = existingProfile.id;
      }
    }

    // Insert into Supabase with error handling
    const { error: insertError } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        ...record,
        user_id: userId || null,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return new Response(JSON.stringify({ error: `Database error: ${insertError.message}` }), { status: 500, headers: CORS_HEADERS });
    }

    const notionStatus =
      record.status === "new" ? "Not started" :
      record.status === "in_progress" ? "In progress" :
      record.status === "done" ? "Done" :
      "Not started";

    const notionBody = {
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        "First Name": { title: [{ text: { content: record.first_name ?? "" } }] },
        "Last Name": { rich_text: [{ text: { content: record.last_name ?? "" } }] },
        "Email": { email: record.email ?? "" },
        "Subject": { rich_text: [{ text: { content: record.subject ?? "" } }] },
        "Status": { status: { name: notionStatus } },
        "CreatedAt": { date: { start: record.created_at ?? new Date().toISOString() } },
      },
    };

    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notionBody),
    });

    if (!notionRes.ok) {
      const errorText = await notionRes.text();
      return new Response(JSON.stringify({ success: false, error: errorText }), { status: 500, headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS_HEADERS });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});