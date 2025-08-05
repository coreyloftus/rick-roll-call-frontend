import { TwilioCallResponse, TwilioCallStatusResponse, TwilioStatusResponse } from './types/twilioCalls'

// const devBaseEndpoint = process.env.DEV_BASE_ENDPOINT
const prodBaseEndpoint = process.env.PROD_BASE_ENDPOINT
interface TwilioCallParams {
    to_phone_number: string
    audio_file_url: string
}
export async function twilioCall(params: TwilioCallParams) {
    console.log('twilioCall called with phoneNumber:', params.to_phone_number, 'and audioUrl:', params.audio_file_url)
    const res = await fetch(`${prodBaseEndpoint}/twilio/call`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(params)
    })
    const resJSON = await res.json()
    console.log('twilioCall response:', resJSON)
    return resJSON as TwilioCallResponse
}

export async function getTwilioStatus() {
    const res = await fetch(`${prodBaseEndpoint}/twilio/status`, {
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

export async function getTwilioCallStatus(callId: string) {
    const res = await fetch(`${prodBaseEndpoint}/twilio/status/${callId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    const resData = (await res.json()) as TwilioCallStatusResponse
    console.log('twilioCallStatus response:', resData)
    return resData
}
