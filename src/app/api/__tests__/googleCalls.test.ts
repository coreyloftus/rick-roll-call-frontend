import { backendSanityCheck, gcsFileUpload, geminiAudio, geminiTest } from '../googleCalls'
import { GCSFileUploadResponse, GeminiTextTestResponse } from '../types/googleCalls'

// Mock Response types
interface MockHeaders {
    get: jest.Mock
    entries: jest.Mock
}

interface MockResponse {
    ok: boolean
    status?: number
    statusText?: string
    json?: jest.Mock
    blob?: jest.Mock
    headers?: MockHeaders
}

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
    mockFetch.mockClear()
    global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('googleCalls API functions', () => {
    describe('backendSanityCheck', () => {
        it('should successfully make sanity check request', async () => {
            const mockResponse: MockResponse = {
                ok: true,
                status: 200
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await backendSanityCheck()

            expect(mockFetch).toHaveBeenCalledWith('http://test-backend.com/sanity_check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            expect(result).toBeDefined()
        })

        it('should throw error when sanity check fails', async () => {
            const mockResponse: MockResponse = {
                ok: false,
                status: 500
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            await expect(backendSanityCheck()).rejects.toThrow('sanity check failed')
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            await expect(backendSanityCheck()).rejects.toThrow('Network error')
        })
    })

    describe('geminiTest', () => {
        const mockGeminiResponse: GeminiTextTestResponse = {
            prompt: 'test prompt',
            response: {
                candidates: [
                    {
                        content: {
                            parts: [{ videoMetadata: null, text: 'Test response text' }],
                            role: 'model'
                        },
                        citationMetadata: { citations: [] },
                        finishMessage: null,
                        tokenCount: null,
                        finishReason: 'STOP'
                    }
                ],
                createTime: '2024-01-01T00:00:00Z',
                modelVersion: 'gemini-1.5-flash',
                usageMetadata: { candidatesTokenCount: 10, promptTokenCount: 5 }
            }
        }

        it('should successfully generate text response', async () => {
            const mockResponse: MockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockGeminiResponse)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await geminiTest('test prompt')

            expect(mockFetch).toHaveBeenCalledWith('http://test-backend.com/gemini/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ prompt: 'test prompt' })
            })
            expect(result).toBe('Test response text')
        })

        it('should handle empty response gracefully', async () => {
            const emptyResponse = {
                ...mockGeminiResponse,
                response: {
                    ...mockGeminiResponse.response,
                    candidates: [
                        {
                            ...mockGeminiResponse.response.candidates[0],
                            content: {
                                parts: [{ videoMetadata: null, text: '' }],
                                role: 'model'
                            }
                        }
                    ]
                }
            }

            const mockResponse: MockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValueOnce(emptyResponse)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await geminiTest('test prompt')
            expect(result).toBe('')
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            await expect(geminiTest('test prompt')).rejects.toThrow('Network error')
        })
    })

    describe('geminiAudio', () => {
        it('should successfully generate audio and return metadata', async () => {
            const mockBlob = new Blob(['audio data'], { type: 'audio/wav' })

            const mockResponse: MockResponse = {
                ok: true,
                headers: {
                    get: jest.fn().mockReturnValue('audio/wav'),
                    entries: jest.fn().mockReturnValue([['content-type', 'audio/wav']])
                },
                blob: jest.fn().mockResolvedValueOnce(mockBlob)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await geminiAudio('test text')

            expect(mockFetch).toHaveBeenCalledWith('http://test-backend.com/gemini/audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ prompt: 'test text' })
            })

            expect(result).toMatchObject({
                url: 'mock-blob-url',
                type: 'audio/wav',
                size: mockBlob.size,
                originalType: 'audio/wav',
                contentType: 'audio/wav'
            })
            expect(global.URL.createObjectURL).toHaveBeenCalled()
        })

        it('should handle unknown MIME types', async () => {
            const mockBlob = new Blob(['audio data'], { type: 'application/octet-stream' })

            const mockResponse: MockResponse = {
                ok: true,
                headers: {
                    get: jest.fn().mockReturnValue('audio/mpeg'),
                    entries: jest.fn().mockReturnValue([['content-type', 'audio/mpeg']])
                },
                blob: jest.fn().mockResolvedValueOnce(mockBlob)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await geminiAudio('test text')

            expect(result.type).toBe('audio/mpeg')
            expect(result.originalType).toBe('application/octet-stream')
        })

        it('should handle missing content-type header', async () => {
            const mockBlob = new Blob(['audio data'], { type: '' })

            const mockResponse: MockResponse = {
                ok: true,
                headers: {
                    get: jest.fn().mockReturnValue(null),
                    entries: jest.fn().mockReturnValue([])
                },
                blob: jest.fn().mockResolvedValueOnce(mockBlob)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await geminiAudio('test text')

            expect(result.type).toBe('')
            expect(result.contentType).toBeNull()
        })

        it('should throw error when request fails', async () => {
            const mockResponse: MockResponse = {
                ok: false,
                statusText: 'Internal Server Error'
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            await expect(geminiAudio('test text')).rejects.toThrow('Failed to fetch audio: Internal Server Error')
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            await expect(geminiAudio('test text')).rejects.toThrow('Network error')
        })
    })

    describe('gcsFileUpload', () => {
        const mockFile = new File(['file content'], 'test.wav', { type: 'audio/wav' })
        const mockUploadResponse: GCSFileUploadResponse = {
            signed_url: 'https://storage.googleapis.com/bucket/file',
            message: 'Upload successful',
            file_name: 'test.wav'
        }

        it('should successfully upload file', async () => {
            const mockResponse: MockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockUploadResponse)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await gcsFileUpload(mockFile)

            expect(mockFetch).toHaveBeenCalledWith(
                'http://test-backend.com/gcs/upload',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: expect.any(FormData)
                })
            )

            const call = mockFetch.mock.calls[0]
            const formData = call[1]?.body as FormData
            expect(formData.get('file')).toBe(mockFile)

            expect(result).toEqual(mockUploadResponse)
        })

        it('should throw error when upload fails', async () => {
            const mockResponse: MockResponse = {
                ok: false,
                statusText: 'Bad Request'
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            await expect(gcsFileUpload(mockFile)).rejects.toThrow('Failed to initiate GCS upload: Bad Request')
        })

        it('should handle different file types', async () => {
            const audioFile = new File(['audio'], 'audio.mp3', { type: 'audio/mp3' })

            const mockResponse: MockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValueOnce({
                    ...mockUploadResponse,
                    file_name: 'audio.mp3'
                })
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await gcsFileUpload(audioFile)

            expect(result.file_name).toBe('audio.mp3')
        })

        it('should handle network errors', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'))

            await expect(gcsFileUpload(mockFile)).rejects.toThrow('Network error')
        })

        it('should handle large files', async () => {
            const largeContent = 'x'.repeat(10000)
            const largeFile = new File([largeContent], 'large.wav', { type: 'audio/wav' })

            const mockResponse: MockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockUploadResponse)
            }
            mockFetch.mockResolvedValueOnce(mockResponse as unknown as Response)

            const result = await gcsFileUpload(largeFile)

            expect(result).toEqual(mockUploadResponse)

            const call = mockFetch.mock.calls[0]
            const formData = call[1]?.body as FormData
            const uploadedFile = formData.get('file') as File
            expect(uploadedFile.size).toBe(largeContent.length)
        })
    })
})
