import { Box, Button, Paper, Typography } from '@mui/material'
import GenAudioBox from './GenAudioBox'
import { useState } from 'react'
import TwilioBox from './TwilioBox'

export const CardBox = () => {
    const [currentCard, setCurrentCard] = useState(0)
    const [publicAudioUrl, setPublicAudioUrl] = useState('')

    // what are the conditions to advance to the next card?
    // user has generated audio, and audio has been uploaded to GCS (publicAudioUrl != '')

    // useEffect(() => {
    //     if (audioData?.url && publicAudioUrl) {
    //         setCurrentCard(currentCard+1)
    //     }
    // }, [audioData?.url, publicAudioUrl])

    const cards = [
        {
            title: '1. Make Some Audio',
            component: <GenAudioBox setPublicAudioUrl={setPublicAudioUrl} />
        },
        {
            title: '2. Rick Roll Yourself',
            component: <TwilioBox audioUrl={publicAudioUrl} />
        },
        {
            title: '3. Call Status',
            component: (
                <>
                    <Typography>Call Status</Typography>
                </>
            )
        }
    ]
    return (
        <>
            {/* card display */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>{cards[currentCard].component}</Paper>
            {/* card prev/next buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button onClick={() => setCurrentCard(currentCard - 1)} disabled={currentCard === 0}>
                    Previous
                </Button>
                <Button onClick={() => setCurrentCard(currentCard + 1)} disabled={currentCard === cards.length - 1}>
                    Next
                </Button>
            </Box>
        </>
    )
}
