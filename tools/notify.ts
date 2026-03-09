import { tool } from "@opencode-ai/plugin"
import { z } from "zod"

// Default system sounds
// CUSTOMIZATION: Change these paths to use custom gaming sounds
// Example: Download gaming sounds and update paths like:
// gaming: "/home/username/.local/share/sounds/level-up.ogg"
// achievement: "/home/username/.local/share/sounds/achievement.ogg"
const DEFAULT_SOUNDS: Record<string, string> = {
  message: "/usr/share/sounds/freedesktop/stereo/message.oga",
  bell: "/usr/share/sounds/freedesktop/stereo/bell.oga",
  complete: "/usr/share/sounds/freedesktop/stereo/hearthstone-jobs-done.mp3",
  alert: "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga",
  // Add custom sound presets here:
  // gaming: "/path/to/power-up-sound.ogg",
  // success: "/path/to/success-sound.ogg",
  // error: "/path/to/error-sound.ogg",
}

export default tool({
  description: "Send desktop notification with visual popup and optional sound alert. Uses notify-send and paplay for Linux notifications.",
  args: {
    title: z.string().describe("Notification title"),
    message: z.string().describe("Notification message body"),
    urgency: z.enum(["low", "normal", "critical"]).optional().describe("Notification urgency level (affects visual styling). Default: 'normal'"),
    icon: z.string().optional().describe("Icon name or path for notification (e.g., 'dialog-information', 'dialog-error'). Default: no icon"),
  },
  async execute(args) {
    const {
      title,
      message,
      urgency = "normal",
      icon
    } = args

    try {
      // Build command arguments for notification
      const notifyArgs = ["-u", urgency]
      if (icon) {
        notifyArgs.push("-i", icon)
      }
      notifyArgs.push(title, message)

      // Send notification using Bun.$
      await Bun.$`notify-send ${notifyArgs}`.quiet()

      // Play sound using paplay with Bun.$
      try {
        await Bun.$`paplay ${DEFAULT_SOUNDS.complete}`.quiet()
      } catch (soundError) {
        // Don't fail the whole notification if sound fails
        const soundErrorMsg = soundError instanceof Error ? soundError.message : String(soundError)
        return `⚠️  Notification sent but sound failed: ${soundErrorMsg}`
      }

      return `✅ Notification sent: "${title}"`

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)

      // Provide helpful error messages
      if (errorMsg.includes("notify-send: not found")) {
        return "Error: notify-send not installed. Install with: sudo apt install libnotify-bin"
      }

      return `Error: ${errorMsg}`
    }
  }
})
