export default async function handler(req, res) {
  try {
    const CHANNEL = "freelance_ethio"; // e.g. "ethiopianjobs"

    const url = https://t.me/s/${CHANNEL}?embed=1&mode=tme;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();

    // 🧠 Extract message blocks
    const messageMatches = [
      ...html.matchAll(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/gs),
    ];

    const jobs = messageMatches.map((match, index) => {
      let raw = match[1];

      // Remove HTML tags
      let text = raw.replace(/<[^>]+>/g, "");

      // Clean text
      text = text
        .replace(/\n+/g, "\n")
        .replace(/&nbsp;/g, " ")
        .trim();

      // Basic parsing (you can improve later)
      const lines = text.split("\n");

      return {
        id: ${index},
        title: lines[0] || "Job post",
        company: "Telegram Channel",
        salary: "Not specified",
        deadline: "Not specified",
        postedDaysAgo: 0,
        location: "Unknown",
        employmentType: "Not specified",
        level: "Not specified",
        description: text,
        responsibilities: [text],
        requirements: ["See description"],
      };
    });

    return res.status(200).json({
      count: jobs.length,
      jobs,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Scraping failed",
      message: err.message,
    });
  }
}
