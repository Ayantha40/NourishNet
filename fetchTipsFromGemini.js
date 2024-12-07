import axios from 'axios';

const fetchTipsFromGemini = async () => {
  const apiKey = 'AIzaSyB61I_PZas6qEeOGd9VQLKGp_9zY8XNUnQ';   const prompt = "Provide 5 short and practical tips for reducing food waste and promoting sustainability. Each tip should be no more than one sentence long and focus on simple actions individuals can take daily.";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        "contents": [
          {
            "parts": [
              {
                "text": prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Full API Response:", response.data);

    // Extract the text from the content.parts[0].text field
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      // Remove any asterisks and unnecessary formatting
      const cleanedText = text.replace(/\*\*/g, '');  // Remove all asterisks

      // Remove numbers and periods at the start of each line
      const tips = cleanedText
        .trim()
        .split("\n")
        .map(tip => tip.replace(/^\d+\.?\s*/, ''))  // Remove numbers and periods
        .filter(tip => tip);  // Filter out any empty strings

      console.log("Extracted Tips:", tips);  // Log the extracted tips for debugging
      return tips;
    } else {
      return ["No tips were generated. Please try again later."];
    }
  } catch (error) {
    console.error("Error fetching Gemini-generated tips:", error.response ? error.response.data : error.message);
    return ["Error fetching tips. Please try again later."];
  }
};

export default fetchTipsFromGemini;
