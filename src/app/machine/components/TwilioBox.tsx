import { getTwilioCallStatus, twilioCall } from '@/app/api/twilioCalls'
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
    DialogActions,
    InputLabel,
    Input,
    FormHelperText
} from '@mui/material'
import { useState, useRef, useEffect } from 'react'

interface TwilioBoxProps {
    audioUrl: string
}
export default function TwilioBox({ audioUrl }: TwilioBoxProps) {
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isAgreed, setIsAgreed] = useState(false)
    const termsLinkRef = useRef<HTMLButtonElement>(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [twilioCallState, setTwilioCallState] = useState({
        status: null as 'queued' | 'in_progress' | 'completed' | 'failed' | null,
        error: null as string | null,
        callId: null as string | null
    })
    const [isPhoneValid, setIsPhoneValid] = useState(false)
    const consentLanguageText =
        "You understand that by inputting text into the provided box and initiating the service, you are requesting and consenting to receive an automated phone call to the number you provide. This call will play an audio message generated from the text you submitted using Google Gemini's Text-to-Audio service.You acknowledge that this service is a personal software engineering project and not a commercial or official service. You understand that standard message and data rates from your mobile carrier may apply to the call you receive. You confirm that the phone number you provide is your own and that you have the legal right to receive calls at that number. You also agree not to use this service for any unlawful, harmful, or abusive purposes, including but not limited to harassment, spam, or impersonation. Your use of this service is at your own risk. The developer of this project is not responsible for any issues or damages that may arise from your use of the service."

    const handleCallTwilio = async () => {
        console.log('handleCallTwilio called')
        const res = await twilioCall({ to_phone_number: phoneNumber, audio_file_url: audioUrl })
        if (res.ok) {
            const resJSON = await res.json()
            setTwilioCallState({
                status: resJSON.status,
                error: resJSON.error,
                callId: resJSON.call_id
            })
        } else {
            console.error('twilioCall response:', res)
        }
    }
    // get twilio call status every 3 seconds, update twilioCallState
    useEffect(() => {
        const interval = setInterval(async () => {
            if (twilioCallState.callId) {
                const status = await getTwilioCallStatus(twilioCallState.callId)
                setTwilioCallState({
                    ...twilioCallState,
                    status: status.status,
                    error: status.error,
                    callId: status.call_id
                })
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [twilioCallState])

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
        <Box className='twilio-box' sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Typography variant='body1' sx={{ mb: 2 }}>
                Enter your phone number, and Twilio will call you and play your audio.
            </Typography>

            <FormGroup sx={{ mb: 2 }}>
                <InputLabel>Your Phone Number</InputLabel>
                <Input
                    type='tel'
                    value={phoneNumber}
                    onChange={(e) => {
                        // Only allow digits, +, -, (, and )
                        const cleaned = e.target.value.replace(/[^\d+\-()]/g, '')
                        // Limit length to reasonable phone number
                        if (cleaned.length <= 15) {
                            setPhoneNumber(cleaned)
                            setIsPhoneValid(cleaned.length === 0 || /^\+?[\d\-()]{10,15}$/.test(cleaned))
                        }
                    }}
                    error={!isPhoneValid}
                    placeholder='+1 (555) 555-5555'
                />
                <FormHelperText
                    error={phoneNumber.length > 0 && !/^\+?[\d\-()]{10,15}$/.test(phoneNumber)}
                    sx={{
                        marginTop: 0
                    }}
                >
                    {phoneNumber.length > 0 && !/^\+?[\d\-()]{10,15}$/.test(phoneNumber)
                        ? 'Please enter a valid phone number'
                        : ''}
                </FormHelperText>

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
                {audioUrl ? `Audio URL: ${audioUrl.slice(0, 75)}...` : '⬆️ Create an audio file first. ⬆️'}
            </Typography>

            <Button
                variant='contained'
                color='primary'
                onClick={handleCallTwilio}
                disabled={!isAgreed || !audioUrl || !isPhoneValid}
                sx={{ mb: 2 }}
            >
                Call Yourself
            </Button>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                    Twilio Call State: {twilioCallState.status}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                    Twilio Call Error: {twilioCallState.error}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
                    Twilio Call ID: {twilioCallState.callId}
                </Typography>
            </Box>

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
