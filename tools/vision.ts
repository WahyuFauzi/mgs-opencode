import { tool } from "@opencode-ai/plugin"
import { z } from "zod"
import * as fs from "fs/promises"
import * as path from "path"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyCwVqgK4e0P1IS0YSeblmNY_N0BCWJOJuY")

export default tool({
  description: "Analyze image based on the prompt (i.e Is the login button visible?)",
  args: {
    prompt: z.string().describe("Instruction describing what to analyze in the image"),
    imagePath: z.string().describe("Local path to the image file")
  },

  async execute(args) {
    const { prompt, imagePath } = args

    try {
      // 1. Read image
      const absolute = path.resolve(imagePath)
      const imageBuffer = await fs.readFile(absolute)
      const base64 = imageBuffer.toString("base64")

      // 2. Detect MIME type from extension
      const ext = path.extname(absolute).toLowerCase()
      const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
      }
      const mimeType = mimeTypes[ext] || 'image/png'

      // 3. Gemini vision model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

      // 4. Ask the model
      const result = await model.generateContent([
        prompt,
        { inlineData: { mimeType, data: base64 } }
      ])

      return result.response.text()

    } catch (error) {
      return `Image analysis failed: ${error}`
    }
  }
})
