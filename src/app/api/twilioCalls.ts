import { devBaseEndpoint } from './constants'
import { TwilioStatusResponse } from './types/twilioCalls'

interface TwilioCallParams {
    to_phone_number: string
    audio_file_url: string
}
export async function twilioCall(params: TwilioCallParams) {
    console.log('twilioCall called with phoneNumber:', params.to_phone_number, 'and audioUrl:', params.audio_file_url)
    const res = await fetch(`${devBaseEndpoint}/twilio/call`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(params)
    })
    const resJSON = await res.json()
    console.log('twilioCall response:', resJSON)
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
    const resData = (await res.json()) as TwilioStatusResponse
    console.log('twilioStatus response:', resData)
    if (resData.status === 'active') {
        return true
    } else {
        return false
    }
}
