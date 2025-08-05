import { Box, Button, Paper, Typography } from '@mui/material'
import GenAudioBox from './GenAudioBox'
import { useState } from 'react'
import TwilioBox from './TwilioBox'
import CallStatusCard from './CallStatusCard'
import { TwilioCallState } from '@/app/api/types/twilioCalls'

export const CardBox = () => {
    const [currentCard, setCurrentCard] = useState(0)
    const [publicAudioUrl, setPublicAudioUrl] = useState('')
    const [twilioCallState, setTwilioCallState] = useState<TwilioCallState>({
        success: false,
        status: null,
        error: '',
        message: '',
        audio_file_url: null,
        call_sid: null
    })

    // Function to handle advancing to next card
    const handleAdvanceToNextCard = () => {
        if (currentCard < cards.length - 1) {
            setCurrentCard(currentCard + 1)
        }
    }

    const cards = [
        {
            title: '1. Make Some Audio',
            component: <GenAudioBox setPublicAudioUrl={setPublicAudioUrl} />
        },
        {
            title: '2. Rick Roll Yourself',
            component: (
                <TwilioBox
                    audioUrl={publicAudioUrl}
                    twilioCallState={twilioCallState}
                    setTwilioCallState={setTwilioCallState}
                    onCallMade={handleAdvanceToNextCard}
                />
            )
        },
        {
            title: '3. Call Status',
            component: <CallStatusCard twilioCallState={twilioCallState} />
        }
    ]
    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {/* Card Progress Indicator */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                    gap: 1
                }}
            >
                {cards.map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor:
                                index === currentCard
                                    ? '#FF6B9D'
                                    : index < currentCard
                                    ? '#45E3FF'
                                    : 'rgba(69,227,255,0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.2)'
                            }
                        }}
                        onClick={() => setCurrentCard(index)}
                    />
                ))}
            </Box>

            {/* Card Title */}
            <Typography
                variant='h5'
                sx={{
                    textAlign: 'center',
                    mb: 2,
                    fontWeight: 'bold',
                    color: 'primary.main'
                }}
            >
                {cards[currentCard].title}
            </Typography>

            {/* Card Display */}
            <Paper
                sx={{
                    p: 3,
                    minHeight: '400px',
                    transition: 'all 0.3s ease'
                }}
            >
                {cards[currentCard].component}
            </Paper>

            {/* Navigation Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3
                }}
            >
                <Button
                    variant='outlined'
                    onClick={() => setCurrentCard(currentCard - 1)}
                    disabled={currentCard === 0}
                    sx={{ minWidth: '120px' }}
                >
                    ← Previous
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => setCurrentCard(currentCard + 1)}
                    disabled={currentCard === cards.length - 1}
                    sx={{ minWidth: '120px' }}
                >
                    Next →
                </Button>
            </Box>
        </Box>
    )
}
