/*
Run this model in Javascript

> npm install openai
*/
import OpenAI from "openai";

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings. 
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env["GITHUB_TOKEN"];

export async function generateBoard(requirement: string): Promise<string> {

  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token
  });

    try {
        const response = await client.chat.completions.create({
            messages: [
                  {
                    role: "user",
                    content: `
                You are a helpful assistant that outputs Kanban board JSON data. 
                  Your goal is to translate the user's requirement into a set of actionable tasks grouped under at least three columns.
                  Given this requirement: ${requirement}, generate **valid JSON** containing columns and tasks. Break down tasks into small items like ‘Design login flow mockup,’ ‘Implement user authentication API,’ and so on.
                  
                  **Instructions:**
                  1. The JSON must have the structure:
                  {
                    "columns": [
                      {
                        "title": "<Column Title>",
                        "tasks": ["<Task 1>", "<Task 2>", ...]
                      },
                      {
                        "title": "<Column Title>",
                        "tasks": ["<Task 1>", "<Task 2>", ...]
                      },
                      ...
                    ]
                  }
                  2. Include at least three columns (you may rename them to something context-appropriate).
                  3. Each column should contain tasks written in short, action-based phrases.
                  4. The tasks must reflect the content of the provided requirement. For example, if the requirement involves creating a web application, your tasks might include "Define core features", "Design user interface mockups", "Develop backend API", "Test new features", etc.
                  5. Return **only** the JSON response—nothing else. The JSON must be well-formed and valid.
                  
                  **Example** (for illustrative purposes only; please generate tasks relevant to the actual requirement):
                  \`\`\`json
                  {
                    "columns": [
                      {
                        "title": "Pending",
                        "tasks": ["Train users", "Test functionality", "Decommission old system"]
                      },
                      {
                        "title": "Ongoing",
                        "tasks": ["Test functionality", "Train users"]
                      },
                      {
                        "title": "Finalized",
                        "tasks": ["Define requirements", "Setup new environment"]
                      }
                    ]
                  }
                  \`\`\`
                  
                  Now, please provide your Kanban board JSON.
                  `
                  }                  
            ],
            model: "gpt-4o",
        });

        return response.choices[0].message.content?? "";
    } catch (error) {
        console.error(error);
        return "";
    }
}

