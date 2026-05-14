const { GoogleGenAI } = require('@google/genai');

const generateRoadmap = async (roadmapParams) => {
    try {
        const { targetRole, skills, experienceLevel, studyHours, duration, preferredLearningStyle, interests } = roadmapParams;

        // Initialize Google Gen AI
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
            Act as an expert career counselor and senior developer. Create a personalized learning roadmap.
            Target Role: ${targetRole}
            Current Skills: ${skills}
            Experience Level: ${experienceLevel}
            Study Hours per week: ${studyHours}
            Duration: ${duration} months
            Preferred Learning Style: ${preferredLearningStyle}
            Areas of Interest: ${interests}

            You MUST return the output ONLY as a valid JSON object matching exactly this structure (no markdown, no extra text):
            {
                "monthlyRoadmap": [
                    {
                        "month": 1,
                        "focus": "String describing main focus",
                        "weeklyGoals": [
                            {
                                "week": 1,
                                "tasks": ["Task 1", "Task 2"]
                            }
                        ],
                        "suggestedResources": [
                            {"title": "Real Course Title", "type": "Video/Doc", "link": "https://youtube.com/results?search_query=..."}
                        ]
                    }
                ],
                // ... other fields
            }

            IMPORTANT: Provide ONLY REAL, high-quality resource links from YouTube, MDN, FreeCodeCamp, or official documentation. 
            Prioritize NEWLY RELEASED tutorials (2024 or 2025) to ensure links are active and technology is current.
            Do NOT use placeholders like 'https://...'. If you don't have a specific verified 2024/2025 link, provide a direct YouTube search link (e.g., https://www.youtube.com/results?search_query=topic+2025+tutorial) for that topic.
                "projects": [
                    {
                        "title": "Project Name",
                        "description": "Short description",
                        "difficulty": "Beginner/Intermediate/Advanced",
                        "technologiesUsed": ["Tech 1", "Tech 2"],
                        "estimatedCompletionTime": "X hours"
                    }
                ],
                "interviewPrep": [
                    {
                        "topic": "Topic Name",
                        "questions": ["Q1", "Q2"],
                        "tips": ["Tip 1"]
                    }
                ],
                "marketInsights": {
                    "averageSalary": "$X - $Y",
                    "demandLevel": "High/Medium/Low",
                    "topCompanies": ["Company 1", "Company 2"],
                    "futureOutlook": "Text description"
                },
                "skillGapAnalysis": {
                    "missingSkills": ["Skill 1"],
                    "weakAreas": ["Area 1"],
                    "improvementSuggestions": "Summary text"
                },
                "careerAdvice": "A paragraph of advice"
            }
        `;

        console.log("Calling Gemini API with model: gemini-2.0-flash");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        if (response.text) {
            console.log("Raw Response received from Gemini");
            // Clean markdown if present
            const cleanedText = response.text.replace(/```json|```/gi, '').trim();
            try {
                return JSON.parse(cleanedText);
            } catch (e) {
                console.error("JSON Parse Error. Cleaned text:", cleanedText);
                throw new Error("AI returned invalid JSON: " + e.message);
            }
        } else {
            console.error("Gemini Response missing text property:", response);
            throw new Error("No text returned from Gemini API");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate roadmap: " + error.message);
    }
};

const chatWithMentor = async (message, history = []) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        let prompt = `Act as an expert AI Mentor for software development. The user asks: ${message}\n\n`;
        if (history && history.length > 0) {
             prompt += `Previous conversation history context:\n`;
             history.forEach(h => {
                 prompt += `User: ${h.user}\nMentor: ${h.mentor}\n`;
             });
        }
        prompt += "\nAnswer the user helpfully and concisely.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        throw new Error("Failed to chat with mentor: " + error.message);
    }
};

module.exports = { generateRoadmap, chatWithMentor };
