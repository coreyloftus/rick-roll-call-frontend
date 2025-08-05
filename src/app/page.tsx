'use client'
import { Badge, Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { backendSanityCheck } from './api/googleCalls'
import { CardBox } from './components/CardBox'

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
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Fixed Header Section */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(15px)',
                    borderBottom: '2px solid #45E3FF',
                    boxShadow: '0 0 20px rgba(69,227,255,0.3)',
                    p: 3,
                    mb: 2
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        width: '100%'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                    <Typography
                        variant='h5'
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 400,
                            lineHeight: 1.4
                        }}
                    >
                        Create personalized AI voice calls in seconds. Write your message, enter a number, and surprise
                        someone with a custom voice call.
                    </Typography>
                </Box>
            </Box>

            {/* Flexible Content Area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    p: 2,
                    pt: 0
                }}
            >
                <Box
                    sx={{
                        maxWidth: '1200px',
                        width: '100%'
                    }}
                >
                    <CardBox />
                </Box>
            </Box>
        </Box>
    )
}

export default Page
