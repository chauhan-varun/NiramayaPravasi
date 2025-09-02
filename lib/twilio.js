import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTP = async (phone, otp, purpose = 'verification') => {
  try {
    const message = await client.messages.create({
      body: `Your Nirmaya Pravasi ${purpose} code is: ${otp}. This code will expire in 10 minutes.`,
      from: twilioPhoneNumber,
      to: phone
    })
    return { success: true, messageId: message.sid }
  } catch (error) {
    console.error('Twilio error:', error)
    return { success: false, error: error.message }
  }
}

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present (assuming India +91)
  if (cleaned.length === 10) {
    return `+91${cleaned}`
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`
  } else if (cleaned.length === 13 && cleaned.startsWith('+91')) {
    return cleaned
  }
  
  // Return as is if already formatted or unknown format
  return phone
}
