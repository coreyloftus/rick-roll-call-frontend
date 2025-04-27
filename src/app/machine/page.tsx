'use client'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    // Accordion,
    // AccordionDetails,
    // AccordionSummary,
    Box,
    Button,
    TextField,
    Typography
} from '@mui/material'
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect } from 'react'
import { geminiAudio, geminiTest } from '../api/geminiCalls'
import { remark } from 'remark'
import remarkToc from 'remark-toc'
import ReactMarkdown from 'react-markdown'
import AudioPlayer from './components/AudioPlayer'

const Page = () => {
    const [darkMode, setDarkMode] = useState(false)
    const [textValue, setTextValue] = useState('')
    const [geminiReply, setGeminiReply] = useState('reply will be here')
    const testAudioPath = '/audio/obi-wan.mp3'

    const [voiceInputText, setVoiceInputText] = useState('')
    const [audioUrl, setAudioUrl] = useState('')
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    useEffect(() => {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (darkMode) {
            setDarkMode(true)
            console.log('dark mode')
        }
    }, [])

    const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await geminiTest(textValue)
        console.log(textValue)
        const replyText = await res
        const processedMarkdown = await remark().use(remarkToc, { heading: 'contents', tight: true }).process(replyText)
        console.log(replyText)
        setGeminiReply(processedMarkdown.toString())
    }

    const handleAudioTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await geminiAudio(voiceInputText)
        try {
            setAudioUrl(res)
            localStorage.setItem('geminiAudioUrl', JSON.stringify(res))
        } catch (err) {
            console.error('Error saving to localStorage', err)
        }
    }

    const badWordDict = ['fuck', 'shit', 'hell']
    return (
        <>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}
            >
                <Box sx={{ border: 1, p: 2, borderRadius: 2, width: '80vw' }}>
                    <Typography variant='h4'>Welcome to Answering Machine</Typography>
                    <Typography variant='h5'>{'This is an AI voice generator for Twilio.'}</Typography>
                    <Accordion>
                        <AccordionSummary>
                            <Typography variant='h6'>Gemini Connection Test</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                id='ai-text-input'
                                label='AI Text Input'
                                variant='outlined'
                                fullWidth
                                placeholder='Enter your text here...'
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                error={badWordDict.includes(textValue)}
                                helperText={badWordDict.includes(textValue) ? 'Please avoid using bad words.' : ''}
                                // change color of input text to white if in dark mode
                                sx={{
                                    input: { color: `${darkMode ? 'white' : 'black'}` },
                                    label: { color: `${darkMode ? 'white' : 'black'}` },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: `${darkMode ? 'white' : 'black'}`
                                        },
                                        '&:hover fieldset': {
                                            borderColor: `${darkMode ? 'gray' : 'darkgray'}`
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: `${darkMode ? 'lightblue' : 'blue'}`
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: `${darkMode ? 'white' : 'black'}`
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: `${darkMode ? 'lightblue' : 'blue'}`
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: `${darkMode ? 'gray' : 'darkgray'}`
                                    }
                                }}
                            />
                            <Button variant='contained' color='primary' onClick={(e) => handleTextSubmit(e)}>
                                Submit
                            </Button>
                            <Box sx={{ mt: 6, width: '100%' }}>
                                <Typography variant='h6' sx={{ textAlign: 'left' }}>
                                    Gemini Reply:
                                </Typography>
                                <Box sx={{ ml: 4 }}>
                                    <ReactMarkdown>{geminiReply}</ReactMarkdown>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary>
                            <Typography variant='h6'>Audio Player</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant='body1'>
                                {
                                    'Input your text and click submit to generate the audio. The audio will be played below.'
                                }
                            </Typography>
                            <TextField
                                id='voice-input-text'
                                label='Voice Input Text'
                                variant='outlined'
                                placeholder='Enter your text here...'
                                value={voiceInputText}
                                onChange={(e) => setVoiceInputText(e.target.value)}
                                sx={{
                                    input: { color: `${darkMode ? 'white' : 'black'}` },
                                    label: { color: `${darkMode ? 'white' : 'black'}` },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: `${darkMode ? 'white' : 'black'}`
                                        },
                                        '&:hover fieldset': {
                                            borderColor: `${darkMode ? 'gray' : 'darkgray'}`
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: `${darkMode ? 'lightblue' : 'blue'}`
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: `${darkMode ? 'white' : 'black'}`
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: `${darkMode ? 'lightblue' : 'blue'}`
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: `${darkMode ? 'gray' : 'darkgray'}`
                                    }
                                }}
                            ></TextField>
                            <Button variant='contained' color='primary' onClick={(e) => handleAudioTextSubmit(e)}>
                                Submit
                            </Button>
                            <Box>
                                <AudioPlayer audioUrl={testAudioPath} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </>
    )
}

export default Page
