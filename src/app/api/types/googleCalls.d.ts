export interface GeminiTextTestResponse {
    prompt: string
    response: {
        candidates: {
            content: { parts: { videoMetadata: null; text: string }[]; role: string }
            citationMetadata: { citations: { title: string; uri: string }[] }
            finishMessage: string | null
            tokenCount: null
            finishReason: string
        }[]
        createTime: string | null
        modelVersion: string
        usageMetadata: { candidatesTokenCount: number; promptTokenCount: number }
    }
}

export interface GCSFileUploadResponse {
    signed_url: string
    message: string
    file_name: string
}
