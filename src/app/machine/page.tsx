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
import { geminiTest, backendSanityCheck } from '../api/googleCalls'
import { remark } from 'remark'
import remarkToc from 'remark-toc'
import ReactMarkdown from 'react-markdown'
import TwilioBox from './components/TwilioBox'
import GenAudioBox from './components/GenAudioBox'
// import TwilioBox from './components/TwilioBox'

const Page = () => {
    const [darkMode, setDarkMode] = useState(false)
    const [geminiTextValue, setGeminiTextValue] = useState('')
    const [geminiReply, setGeminiReply] = useState('reply will be here')
    const [sanityCheckTextValue, setSanityCheckTextValue] = useState('')
    const [sanityCheckText, setSanityCheckText] = useState('')
    const [publicAudioUrl, setPublicAudioUrl] = useState('')

    useEffect(() => {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (darkMode) {
            setDarkMode(true)
            console.log('dark mode')
        }
    }, [])

    const sanityCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await backendSanityCheck(sanityCheckTextValue)
            if (res) {
                console.log('Sanity check response:', res)
                setSanityCheckText(JSON.stringify(res))
            }
        } catch (e) {
            console.error('Error during sanity check:', e)
            setSanityCheckText('Error during sanity check. Please try again.')
        }
    }

    const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await geminiTest(geminiTextValue)
        console.log(geminiTextValue)
        const replyText = await res
        const processedMarkdown = await remark().use(remarkToc, { heading: 'contents', tight: true }).process(replyText)
        console.log(replyText)
        setGeminiReply(processedMarkdown.toString())
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
                            <Typography variant='h6'>Sanity check</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                id='ai-text-input'
                                label='AI Text Input'
                                variant='outlined'
                                fullWidth
                                placeholder='Enter your text here...'
                                value={sanityCheckTextValue}
                                onChange={(e) => setSanityCheckTextValue(e.target.value)}
                                error={badWordDict.includes(sanityCheckTextValue)}
                                helperText={
                                    badWordDict.includes(sanityCheckTextValue) ? 'Please avoid using bad words.' : ''
                                }
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
                            <Button variant='contained' color='primary' onClick={(e) => sanityCheckSubmit(e)}>
                                Submit
                            </Button>
                            <Box sx={{ mt: 6, width: '100%' }}>
                                <Typography variant='h6' sx={{ textAlign: 'left' }}>
                                    Server Reply:
                                </Typography>
                                <Box sx={{ ml: 4 }}>
                                    <ReactMarkdown>{sanityCheckText}</ReactMarkdown>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
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
                                value={geminiTextValue}
                                onChange={(e) => setGeminiTextValue(e.target.value)}
                                error={badWordDict.includes(geminiTextValue)}
                                helperText={
                                    badWordDict.includes(geminiTextValue) ? 'Please avoid using bad words.' : ''
                                }
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
                            <GenAudioBox setPublicAudioUrl={setPublicAudioUrl} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Typography variant='h6'>Send it to Twilio and Call Yourself</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TwilioBox audioUrl={publicAudioUrl} />
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </>
    )
}

export default Page
