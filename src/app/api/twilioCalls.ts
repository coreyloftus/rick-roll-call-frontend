import { devBaseEndpoint } from './constants'
import { TwilioStatusResponse } from './types/twilioCalls'

export async function twilioCall(phoneNumber: string, audioUrl: string) {
    console.log('twilioCall called with phoneNumber:', phoneNumber, 'and audioUrl:', audioUrl)
    const res = await fetch(`${devBaseEndpoint}/twilio/call`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ phoneNumber, audioUrl })
    })
    console.log('twilioCall response:', res)
    return res
}

export async function getTwilioStatus() {
    const res = await fetch(`${devBaseEndpoint}/twilio/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    console.log('twilioStatus response:', res)
    const resData = (await res.json()) as TwilioStatusResponse
    if (resData.status === 'success') {
        return true
    } else {
        return false
    }
}
