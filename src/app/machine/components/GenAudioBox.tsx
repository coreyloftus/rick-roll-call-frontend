import { useState } from 'react'
import { Typography, Box, TextField, Button } from '@mui/material'
import { gcsFileUpload, geminiAudio } from '@/app/api/googleCalls'
import AudioPlayer from './AudioPlayer'

interface GenAudioBoxProps {
    setPublicAudioUrl: React.Dispatch<React.SetStateAction<string>>
}
export default function GenAudioBox({ setPublicAudioUrl }: GenAudioBoxProps) {
    const [audioUrl, setAudioUrl] = useState<string>('')
    const [voiceInputText, setVoiceInputText] = useState<string>('')

    const handleAudioTextSubmitToGemini = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await geminiAudio(voiceInputText)
        try {
            console.log('Audio URL:', res)
            localStorage.setItem('geminiAudioUrl', JSON.stringify(res))
            setAudioUrl(res)
        } catch (err) {
            console.error('Error saving to localStorage', err)
        }
    }

    const handleAudioFileUploadToGCS = async (e: React.FormEvent, audioUrl: string) => {
        e.preventDefault()
        if (!audioUrl) {
            console.error('No audio URL provided to upload to GCS.')
            return
        }
        // audioUrl is a blobURL, we need to convert it to a File object
        const blobResponse = await fetch(audioUrl)
        const blob = await blobResponse.blob()
        const file = new File([blob], 'audio.mp3', { type: blob.type })
        try {
            const response = await gcsFileUpload(file)
            console.log('GCS upload response:', response)
            setPublicAudioUrl(response.signed_url)
        } catch (e) {
            console.error(`Error uploading audio file to GCS:`, e)
        }
    }

    return (
        <>
            <Typography variant='body1'>
                {'Input your text and click submit to generate the audio. The audio will be played below.'}
            </Typography>
            <TextField
                id='voice-input-text'
                label='Voice Input Text'
                variant='outlined'
                placeholder='Enter your text here...'
                value={voiceInputText}
                onChange={(e) => setVoiceInputText(e.target.value)}
                sx={{}}
            ></TextField>
            <Button variant='contained' color='primary' onClick={(e) => handleAudioTextSubmitToGemini(e)}>
                Submit
            </Button>
            <Box>
                <AudioPlayer audioUrl={audioUrl} />
            </Box>
            <Box>
                <Button variant='contained' color='primary' onClick={(e) => handleAudioFileUploadToGCS(e, audioUrl)}>
                    Upload Audio to GCS
                </Button>
            </Box>
        </>
    )
}
