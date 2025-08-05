import { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import { gcsFileUpload, geminiAudio } from '@/app/api/googleCalls'
import AudioPlayer from './AudioPlayer'

interface AudioData {
    url: string
    type: string
    size: number
    originalType: string
    contentType: string | null
}

interface GenAudioBoxProps {
    setPublicAudioUrl: React.Dispatch<React.SetStateAction<string>>
}
export default function GenAudioBox({ setPublicAudioUrl }: GenAudioBoxProps) {
    const [audioData, setAudioData] = useState<AudioData | null>(null)
    const [voiceInputText, setVoiceInputText] = useState<string>('')

    const handleAudioTextSubmitToGemini = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await geminiAudio(voiceInputText)
            console.log('Audio data received:', res)
            localStorage.setItem('geminiAudioData', JSON.stringify(res))
            setAudioData(res)
        } catch (err) {
            console.error('Error getting audio from Gemini:', err)
        }
    }

    const handleAudioFileUploadToGCS = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!audioData?.url) {
            console.error('No audio URL provided to upload to GCS.')
            return
        }
        // audioUrl is a blobURL, we need to convert it to a File object
        try {
            const blobResponse = await fetch(audioData.url)
            const blob = await blobResponse.blob()
            const file = new File([blob], 'audio.mp3', { type: blob.type })
            const response = await gcsFileUpload(file)
            console.log('GCS upload response:', response)
            setPublicAudioUrl(response.signed_url)
        } catch (e) {
            console.error(`Error uploading audio file to GCS:`, e)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant='body1' sx={{ textAlign: 'center', mb: 2 }}>
                {` 🎵 Enter some text below and we'll generate custom audio using Google Gemini!`}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: 'flex-start'
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <form onSubmit={handleAudioTextSubmitToGemini}>
                        <TextField
                            id='voice-input-text'
                            // label='✨ Your Message'
                            placeholder='Make it so, number one!'
                            multiline
                            rows={4}
                            value={voiceInputText}
                            onChange={(e) => setVoiceInputText(e.target.value)}
                            fullWidth
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': {
                                        borderColor: '#45E3FF',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#00FFFF'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF6B9D'
                                    }
                                }
                            }}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            disabled={voiceInputText === ''}
                            size='large'
                            sx={{
                                width: '100%',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            🎤 Generate Audio
                        </Button>
                    </form>

                    {audioData?.url && (
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={handleAudioFileUploadToGCS}
                                size='large'
                                sx={{
                                    width: '100%',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    background: `linear-gradient(45deg, #45E3FF 30%, #FFE66D 90%)`,
                                    '&:hover': {
                                        background: `linear-gradient(45deg, #00FFFF 30%, #FFE66D 90%)`
                                    }
                                }}
                            >
                                ☁️ Upload to Cloud
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '200px',
                        justifyContent: 'center'
                    }}
                >
                    {audioData?.url ? (
                        <AudioPlayer audioData={audioData} />
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                                opacity: 0.7
                            }}
                        >
                            <Typography variant='h2' sx={{ mb: 1 }}>
                                🔇
                            </Typography>
                            <Typography variant='body2'>Your audio will appear here.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
