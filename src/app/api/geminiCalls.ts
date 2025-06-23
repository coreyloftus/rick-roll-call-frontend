import { GeminiTextTestResponse } from './types/geminiCalls'

const devBaseEndpoint = 'http://127.0.0.1:8000'
export async function backendSanityCheck(req: string) {
    console.log('backendSanityCheck called with req:', req)
    const res = await fetch(`${devBaseEndpoint}/sanity_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ prompt: req })
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch sanity check: ${res.statusText}`)
    }
    return await res.json()
}
export async function geminiTest(req: string) {
    console.log('geminiTest called with req:', req)
    const res = await fetch(`${devBaseEndpoint}/gemini`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ prompt: req })
    })

    const responseBody = (await res.json()) as GeminiTextTestResponse
    console.log('geminiTest response:', responseBody)
    return responseBody.response.candidates[0].content.parts[0].text
}

export async function geminiAudio(req: string) {
    console.log(`${geminiAudio.name} called with req:`, req)
    const res = await fetch(`${devBaseEndpoint}/gemini/audio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ prompt: req })
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch audio: ${res.statusText}`)
    }

    const audioBlob = await res.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    // Return the audio URL to the frontend
    return audioUrl
}
