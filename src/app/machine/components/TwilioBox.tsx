import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import { useState, useRef } from 'react'

interface TwilioBoxProps {
    audioUrl: string
}
export default function TwilioBox({ audioUrl }: TwilioBoxProps) {
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isAgreed, setIsAgreed] = useState(false)
    const termsLinkRef = useRef<HTMLButtonElement>(null)

    const consentLanguageText =
        "You understand that by inputting text into the provided box and initiating the service, you are requesting and consenting to receive an automated phone call to the number you provide. This call will play an audio message generated from the text you submitted using Google Gemini's Text-to-Audio service.You acknowledge that this service is a personal software engineering project and not a commercial or official service. You understand that standard message and data rates from your mobile carrier may apply to the call you receive. You confirm that the phone number you provide is your own and that you have the legal right to receive calls at that number. You also agree not to use this service for any unlawful, harmful, or abusive purposes, including but not limited to harassment, spam, or impersonation. Your use of this service is at your own risk. The developer of this project is not responsible for any issues or damages that may arise from your use of the service."

    const handleAudioToTwilio = () => {
        console.log('handleAudioToTwilio called')
    }

    const handleOpenTerms = () => {
        // Blur the current element to remove focus before opening modal
        if (termsLinkRef.current) {
            termsLinkRef.current.blur()
        }
        setIsTermsOpen(true)
    }

    const handleCloseTerms = () => {
        setIsTermsOpen(false)
        // Return focus to the terms link after modal closes
        setTimeout(() => {
            if (termsLinkRef.current) {
                termsLinkRef.current.focus()
            }
        }, 100)
    }

    const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(event.target.checked)
    }

    const handleAgreeAndClose = () => {
        setIsAgreed(true)
        setIsTermsOpen(false)
        // Don't return focus to the link since user has agreed
    }

    return (
        <Box className='twilio-box'>
            <Typography variant='h2'>Twilio Integration</Typography>

            <Typography variant='body1' sx={{ mb: 2 }}>
                This service will send an automated phone call with your generated audio message.
            </Typography>

            <FormGroup sx={{ mb: 2 }}>
                <FormControlLabel
                    control={<Checkbox checked={isAgreed} onChange={handleAgreementChange} />}
                    label={
                        <Typography variant='body2'>
                            I agree to the{' '}
                            <Button
                                ref={termsLinkRef}
                                variant='text'
                                size='small'
                                onClick={handleOpenTerms}
                                sx={{
                                    textDecoration: 'underline',
                                    textTransform: 'none',
                                    fontSize: 'inherit',
                                    fontWeight: 'inherit',
                                    minWidth: 'auto',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                terms and conditions
                            </Button>{' '}
                            of the Twilio integration.
                        </Typography>
                    }
                />
            </FormGroup>

            <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                {audioUrl ? `Audio URL: ${audioUrl}` : '⬆️ Create an audio file first. ⬆️'}
            </Typography>

            <Button
                variant='contained'
                color='primary'
                onClick={handleAudioToTwilio}
                disabled={!isAgreed || !audioUrl}
                sx={{ mb: 2 }}
            >
                Send to Twilio
            </Button>

            {/* Terms and Conditions Modal */}
            <Dialog
                open={isTermsOpen}
                onClose={handleCloseTerms}
                maxWidth='md'
                fullWidth
                scroll='paper'
                aria-labelledby='terms-dialog-title'
                aria-describedby='terms-dialog-content'
            >
                <DialogTitle id='terms-dialog-title'>Terms and Conditions - Twilio Integration</DialogTitle>
                <DialogContent dividers id='terms-dialog-content'>
                    <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                        {consentLanguageText}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTerms} color='primary'>
                        Close
                    </Button>
                    <Button onClick={handleAgreeAndClose} color='primary' variant='contained'>
                        I Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
