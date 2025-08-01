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
        <>
            <Typography variant='h6'>1. Make Some Audio</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        id='voice-input-text'
                        label='Text to turn into audio'
                        variant='outlined'
                        placeholder='Enter your text here...'
                        value={voiceInputText}
                        onChange={(e) => setVoiceInputText(e.target.value)}
                        sx={{}}
                    ></TextField>
                    <Button variant='contained' color='primary' onClick={(e) => handleAudioTextSubmitToGemini(e)}>
                        Generate Audio
                    </Button>
                </Box>

                <Box sx={{ alignSelf: 'flex-end' }}>
                    <AudioPlayer audioData={audioData} />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleAudioFileUploadToGCS}
                        disabled={!audioData?.url}
                    >
                        Confirm audio
                    </Button>
                </Box>
            </Box>
        </>
    )
}
