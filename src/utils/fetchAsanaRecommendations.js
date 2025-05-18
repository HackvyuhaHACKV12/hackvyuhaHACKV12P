// export default async function fetchAsanaRecommendations(conditions = []) {
//   const OPENROUTER_API_KEY = "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";

//   if (!Array.isArray(conditions) || conditions.length === 0) {
//     throw new Error("Health conditions must be a non-empty array");
//   }

//   const prompt = `Suggest 3 yoga asanas for someone with: ${conditions.join(", ")}.
// For each asana, include:
// 1. Name
// 2. Benefits
// 3. 3-step instructions (short)
// Return JSON array format like:
// [
//   {
//     "name": "Tadasana",
//     "benefits": "Improves posture and balance.",
//     "steps": [
//       "1.Stand straight with feet together",
//       "2.Raise arms overhead",
//       "3.Stretch upwards and hold for 10 seconds"
//     ]
//   }
// ]`;

//   try {
//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a certified yoga therapist." },
//           { role: "user", content: prompt }
//         ]
//       })
//     });

//     const data = await res.json();

//     if (data?.choices?.[0]?.message?.content) {
//       let rawContent = data.choices[0].message.content.trim();

//       // ✅ Strip ```json ... ``` if present
//       if (rawContent.startsWith("```")) {
//         rawContent = rawContent.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
//       }

//       try {
//         return JSON.parse(rawContent);
//       } catch (err) {
//         console.error("Failed to parse OpenRouter JSON response:", err);
//         return [];
//       }
//     } else {
//       console.warn("No valid response from OpenRouter");
//       return [];
//     }
//   } catch (error) {
//     console.error("API fetch error:", error);
//     return [];
//   }
// }



// src/utils/fetchAsanaRecommendations.js

//  const OPENROUTER_API_KEY = "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"; // Replace with your OpenRouter API key
// const PEXELS_API_KEY = "wApPKf4e6z16foxPp7eCiSfkR8wIkGgupFnZymEU5Fuo1J392tZ7Y37A"; // Replace with your Pexels API key

// async function fetchImageForAsana(asanaName) {
//   try {
//     const response = await fetch(
//       `https://api.pexels.com/v1/search?query=${encodeURIComponent(asanaName + " yoga pose")}&per_page=1`,
//       {
//         headers: {
//           Authorization: PEXELS_API_KEY,
//         },
//       }
//     );
//     const data = await response.json();
//     return data.photos[0]?.src?.medium || "/asana-images/default.jpg";
//   } catch (error) {
//     console.error("Error fetching image from Pexels:", error);
//     return "/asana-images/default.jpg";
//   }
// }

// export default async function fetchAsanaRecommendations(conditions = []) {
//   if (!Array.isArray(conditions) || conditions.length === 0) {
//     throw new Error("Health conditions must be a non-empty array");
//   }

//   const prompt = `Suggest 3 yoga asanas for someone with: ${conditions.join(", ")}.
// For each asana, include:
// 1. Name
// 2. Benefits
// 3. 3-step instructions (short)
// Return JSON array format like:
// [
//   {
//     "name": "Tadasana",
//     "benefits": "Improves posture and balance.",
//     "steps": [
//       "1. Stand straight with feet together",
//       "2. Raise arms overhead",
//       "3. Stretch upwards and hold for 10 seconds"
//     ]
//   }
// ]`;

//   try {
//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a certified yoga therapist." },
//           { role: "user", content: prompt },
//         ],
//       }),
//     });

//     const data = await res.json();
//     let content = data?.choices?.[0]?.message?.content?.trim() || "";

//     if (content.startsWith("```")) {
//       content = content.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
//     }

//     const asanas = JSON.parse(content);

//     // Fetch images for each asana
//     const enrichedAsanas = await Promise.all(
//       asanas.map(async (asana) => ({
//         ...asana,
//         image: await fetchImageForAsana(asana.name),
//       }))
//     );

//     return enrichedAsanas;
//   } catch (error) {
//     console.error("API fetch error:", error);
//     return [];
//   }
// }





const OPENROUTER_API_KEY = "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"; // Replace with your OpenRouter API key
const PEXELS_API_KEY = "wApPKf4e6z16foxPp7eCiSfkR8wIkGgupFnZymEU5Fuo1J392tZ7Y37A"; // Replace with your Pexels API key
// src/utils/fetchAsanaRecommendations.js
async function fetchImageForAsana(asanaName) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(asanaName + " yoga pose")}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();
    return data.photos[0]?.src?.medium || "/asana-images/default.jpg";
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return "/asana-images/default.jpg";
  }
}

export default async function fetchAsanaRecommendations(conditions = []) {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    throw new Error("Health conditions must be a non-empty array");
  }

  const prompt = `Suggest 3 yoga asanas for someone with: ${conditions.join(", ")}.
For each asana, include:
1. Name
2. Benefits
3. 3-step instructions (short)
Return JSON array format like:
[
  {
    "name": "Tadasana",
    "benefits": "Improves posture and balance.",
    "steps": [
      "1. Stand straight with feet together",
      "2. Raise arms overhead",
      "3. Stretch upwards and hold for 10 seconds"
    ]
  }
]`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a certified yoga therapist." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await res.json();
    let content = data?.choices?.[0]?.message?.content?.trim() || "";

    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    }

    const asanas = JSON.parse(content);

    // Fetch images for each asana
    const enrichedAsanas = await Promise.all(
      asanas.map(async (asana) => ({
        ...asana,
        image: await fetchImageForAsana(asana.name),
      }))
    );

    return enrichedAsanas;
  } catch (error) {
    console.error("API fetch error:", error);
    return [];
  }
}