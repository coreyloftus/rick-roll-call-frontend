import { GCSFileUploadResponse, GeminiTextTestResponse } from './types/googleCalls'

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

export async function gcsFileUpload(file: File) {
    console.log(`${gcsFileUpload.name} called with file:`, file)
    // change this function to use formData and send the file as a form data object
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${devBaseEndpoint}/gcs/upload`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: formData
    })
    if (!res.ok) {
        console.error(`Failed to initiate GCS upload: ${res.statusText}`)
        throw new Error(`Failed to initiate GCS upload: ${res.statusText}`)
    }
    const resJSON = (await res.json()) as GCSFileUploadResponse
    console.log('backend response:', resJSON)
    return resJSON
}
