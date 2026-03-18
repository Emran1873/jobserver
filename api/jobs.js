export default async function handler(req, res) {
  try {
    const CHANNEL = "freelance_ethio"; //name

    const url = https://t.me/s/${CHANNEL}?embed=1&mode=tme;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to fetch Telegram page",
        status: response.status,
      });
    }

    const html = await response.text();

    // safer regex
    const matches = html.match(/tgme_widget_message_text[\s\S]*?<\/div>/g) || [];

    const jobs = matches.map((block, index) => {
      let text = block
        .replace(/<[^>]+>/g, "")
        .replace(/\n+/g, "\n")
        .replace(/&nbsp;/g, " ")
        .trim();

      const lines = text.split("\n");

      return {
        id: String(index),
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
      error: "Crash",
      message: err.message,
    });
  }
}
