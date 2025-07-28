import { devBaseEndpoint } from './constants'

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
