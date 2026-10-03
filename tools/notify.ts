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

// macOS ships with a set of system sounds under /System/Library/Sounds
const DEFAULT_SOUNDS_MACOS: Record<string, string> = {
  message: "/System/Library/Sounds/Glass.aiff",
  bell: "/System/Library/Sounds/Funk.aiff",
  complete: "/System/Library/Sounds/Glass.aiff",
  alert: "/System/Library/Sounds/Sosumi.aiff",
}

const isMacOS = () => process.platform === "darwin"

// AppleScript string literals use backslash-escaped quotes/backslashes and
// do NOT support \n escapes. Escape manually and collapse newlines so the
// title/message render literally under `osascript -e`.
function appleScriptEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
}

export default tool({
  description: "Send desktop notification with visual popup and optional sound alert. Cross-platform: uses osascript + afplay on macOS, notify-send + paplay on Linux.",
  args: {
    title: z.string().describe("Notification title"),
    message: z.string().describe("Notification message body"),
    urgency: z.enum(["low", "normal", "critical"]).optional().describe("Notification urgency level (affects visual styling). Default: 'normal'"),
    icon: z.string().optional().describe("Icon name or path for notification (e.g., 'dialog-information', 'dialog-error'). Linux only — macOS uses the default app icon. Default: no icon"),
  },
  async execute(args) {
    const {
      title,
      message,
      urgency = "normal",
      icon
    } = args

    try {
      if (isMacOS()) {
        return await sendMacOSNotification(title, message, urgency, icon)
      }
      return await sendLinuxNotification(title, message, urgency, icon)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      return `Error: ${errorMsg}`
    }
  }
})

// macOS: osascript display notification + afplay for sound
async function sendMacOSNotification(
  title: string,
  message: string,
  urgency: string,
  icon?: string
): Promise<string> {
  // Build AppleScript. urgency maps to a subtitle hint (macOS has no native levels).
  const subTitle = urgency === "critical" ? "⚠️ Critical" : urgency === "low" ? "ℹ️ Info" : "🔔"
  const script = `display notification "${appleScriptEscape(message)}" with title "${appleScriptEscape(title)}" subtitle "${appleScriptEscape(subTitle)}"`

  try {
    await Bun.$`osascript -e ${script}`.quiet()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return `⚠️  Notification failed on macOS: ${errorMsg}`
  }

  // Play sound using afplay with Bun.$
  try {
    const sound = DEFAULT_SOUNDS_MACOS[urgency] || DEFAULT_SOUNDS_MACOS.complete
    await Bun.$`afplay ${sound}`.quiet()
  } catch (soundError) {
    // Don't fail the whole notification if sound fails
    const soundErrorMsg = soundError instanceof Error ? soundError.message : String(soundError)
    return `✅ Notification sent: "${title}" (sound failed: ${soundErrorMsg})`
  }

  return `✅ Notification sent: "${title}"`
}

// Linux: notify-send + paplay
async function sendLinuxNotification(
  title: string,
  message: string,
  urgency: string,
  icon?: string
): Promise<string> {
  // Build command arguments for notification
  const notifyArgs = ["-u", urgency]
  if (icon) {
    notifyArgs.push("-i", icon)
  }
  notifyArgs.push(title, message)

  // Send notification using notify-send
  try {
    await Bun.$`notify-send ${notifyArgs}`.quiet()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (errorMsg.includes("notify-send: not found")) {
      return "Error: notify-send not installed. Install with: sudo apt install libnotify-bin"
    }
    return `Error: ${errorMsg}`
  }

  // Play sound using paplay
  try {
    await Bun.$`paplay ${DEFAULT_SOUNDS.complete}`.quiet()
  } catch (soundError) {
    // Don't fail the whole notification if sound fails
    const soundErrorMsg = soundError instanceof Error ? soundError.message : String(soundError)
    return `⚠️  Notification sent but sound failed: ${soundErrorMsg}`
  }

  return `✅ Notification sent: "${title}"`
}
