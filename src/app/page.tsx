'use client'
import { Badge, Box, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { backendSanityCheck } from './api/googleCalls'
import TwilioBox from './components/TwilioBox'
import GenAudioBox from './components/GenAudioBox'

const Page = () => {
    const [sanityCheckSuccess, setSanityCheckSuccess] = useState(false)
    const [publicAudioUrl, setPublicAudioUrl] = useState('')

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
    }, [])
    return (
        <>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    minWidth: '85vw'
                }}
            >
                <Box sx={{ border: 1, p: 2, borderRadius: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                'Create personalized AI voice calls in seconds. Write your message, enter a number, and surprise someone with a custom voice call.'
                            }
                        </Typography>
                    </Box>
                    <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                        <Typography variant='h6'>1. Make Some Audio</Typography>
                        <GenAudioBox setPublicAudioUrl={setPublicAudioUrl} />
                    </Paper>

                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <TwilioBox audioUrl={publicAudioUrl} />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </>
    )
}

export default Page
