import { devBaseEndpoint } from './constants'
import { GCSFileUploadResponse, GeminiTextTestResponse } from './types/googleCalls'

export async function backendSanityCheck() {
    console.log('backendSanityCheck called')
    const res = await fetch(`${devBaseEndpoint}/sanity_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    console.log('sanity check response:', res)
    if (!res.ok) {
        throw new Error(`sanity check failed`)
    }
    return res
}
export async function geminiTest(req: string) {
    console.log('geminiTest called with req:', req)
    const res = await fetch(`${devBaseEndpoint}/gemini/stream`, {
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

    // Log response headers to understand the audio format
    const contentType = res.headers.get('content-type')
    console.log('Response Content-Type:', contentType)
    console.log('Response headers:', [...res.headers.entries()])

    const audioBlob = await res.blob()
    console.log('Audio blob type:', audioBlob.type)
    console.log('Audio blob size:', audioBlob.size)

    // Try to determine the correct MIME type based on content-type or make educated guess
    let mimeType = audioBlob.type

    if (!mimeType || mimeType === 'application/octet-stream') {
        // Try to infer from Content-Type header
        if (contentType) {
            mimeType = contentType
        } else {
            // Default fallbacks - try common web-compatible formats
            console.log('No MIME type detected, trying common audio formats')
            // We'll try multiple formats in the component
        }
    }

    console.log('Final MIME type:', mimeType)

    // Create typed blob with the determined MIME type
    const typedBlob = new Blob([audioBlob], { type: mimeType })
    const audioUrl = URL.createObjectURL(typedBlob)
    console.log('Created audio URL:', audioUrl)

    // Return both the URL and metadata for debugging
    return {
        url: audioUrl,
        type: mimeType,
        size: audioBlob.size,
        originalType: audioBlob.type,
        contentType: contentType
    }
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
