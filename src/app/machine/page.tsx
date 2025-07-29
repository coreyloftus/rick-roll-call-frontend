'use client'
import { Accordion, AccordionDetails, AccordionSummary, Badge, Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { backendSanityCheck } from '../api/googleCalls'
import TwilioBox from './components/TwilioBox'
import GenAudioBox from './components/GenAudioBox'
import { getTwilioStatus } from '../api/twilioCalls'

const Page = () => {
    const [sanityCheckSuccess, setSanityCheckSuccess] = useState(false)
    const [publicAudioUrl, setPublicAudioUrl] = useState('')
    const [twilioStatus, setTwilioStatus] = useState(false)

    const checkTwilioStatus = async () => {
        const status = await getTwilioStatus()
        setTwilioStatus(status)
    }

    const sanityCheckSubmit = async () => {
        try {
            const res = await backendSanityCheck()
            if (res.ok) {
                setSanityCheckSuccess(true)
            }
        } catch (e) {
            console.error('sanity check failed:', e)
            setSanityCheckSuccess(false)
        }
    }

    useEffect(() => {
        sanityCheckSubmit()
        checkTwilioStatus()
    }, [])
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
                <Box sx={{ border: 1, p: 2, borderRadius: 2, width: '85vw', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography sx={{ flexGrow: 1 }} variant='h4'>
                                Rick Roll Call
                            </Typography>
                            <Badge
                                color={sanityCheckSuccess ? 'success' : 'error'}
                                variant='dot'
                                sx={{
                                    '& .MuiBadge-dot': {
                                        transform: 'translate(50%, -200%)',
                                        top: 0,
                                        right: 0,
                                        height: 16,
                                        width: 16,
                                        borderRadius: '50%'
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant='h5'>
                            {
                                'Write some text. Enter your phone number. Then, get a call from an AI voice speaking out the text you wrote.'
                            }
                        </Typography>
                        <Typography variant='body1'>{`Please only use this for good and mischief.`}</Typography>
                    </Box>

                    {/* <Accordion>
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
                    </Accordion> */}
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}
                            >
                                <Typography variant='h6'>Make Twilio Call You</Typography>
                                <Badge
                                    color={twilioStatus ? 'success' : 'error'}
                                    variant='dot'
                                    sx={{
                                        '& .MuiBadge-dot': {
                                            transform: 'translate(50%, -150%)',
                                            top: 0,
                                            right: 0,
                                            height: 16,
                                            width: 16,
                                            borderRadius: '50%'
                                        }
                                    }}
                                />
                            </Box>
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
