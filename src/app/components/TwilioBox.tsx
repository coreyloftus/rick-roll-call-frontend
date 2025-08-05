import { getTwilioCallStatus, getTwilioStatus, twilioCall } from '@/app/api/twilioCalls'
import { TwilioCallState } from '@/app/api/types/twilioCalls'
import {
    Badge,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Input,
    InputLabel,
    Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface TwilioBoxProps {
    audioUrl: string
    twilioCallState: TwilioCallState
    setTwilioCallState: (state: TwilioCallState) => void
    onCallMade: () => void
}
export default function TwilioBox({ audioUrl, twilioCallState, setTwilioCallState, onCallMade }: TwilioBoxProps) {
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [isAgreed, setIsAgreed] = useState(false)
    const termsLinkRef = useRef<HTMLButtonElement>(null)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isPhoneValid, setIsPhoneValid] = useState(false)
    const [twilioStatus, setTwilioStatus] = useState(false)

    const checkTwilioStatus = async () => {
        const status = await getTwilioStatus()
        setTwilioStatus(status)
    }

    useEffect(() => {
        checkTwilioStatus()
    }, [])

    const consentLanguageText =
        "You understand that by inputting text into the provided box and initiating the service, you are requesting and consenting to receive an automated phone call to the number you provide. This call will play an audio message generated from the text you submitted using Google Gemini's Text-to-Audio service.You acknowledge that this service is a personal software engineering project and not a commercial or official service. You understand that standard message and data rates from your mobile carrier may apply to the call you receive. You confirm that the phone number you provide is your own and that you have the legal right to receive calls at that number. You also agree not to use this service for any unlawful, harmful, or abusive purposes, including but not limited to harassment, spam, or impersonation. Your use of this service is at your own risk. The developer of this project is not responsible for any issues or damages that may arise from your use of the service."

    const handleCallTwilio = async () => {
        console.log('handleCallTwilio called')
        const res = await twilioCall({
            to_phone_number: phoneNumber,
            audio_file_url: audioUrl
        })
        if (res.success) {
            setTwilioCallState({
                success: true,
                message: res.message,
                audio_file_url: res.audio_file_url,
                call_sid: res.call_sid,
                status: 'queued' as TwilioCallState['status'],
                error: null
            })
            // Advance to the call status card
            onCallMade()
        } else {
            setTwilioCallState({
                success: false,
                error: res.message,
                message: res.message,
                audio_file_url: null,
                call_sid: null,
                status: 'failed' as TwilioCallState['status']
            })
            console.error('twilioCall response:', res)
        }
    }
    // get twilio call status every 3 seconds, update twilioCallState
    useEffect(() => {
        if (twilioCallState.call_sid && twilioCallState.status !== 'completed' && twilioCallState.status !== 'failed') {
            console.log(`polling for call status ${twilioCallState.call_sid}`)
            const interval = setInterval(async () => {
                if (twilioCallState.call_sid) {
                    const res = await getTwilioCallStatus(twilioCallState.call_sid)
                    console.log('twilioCallStatus response:', res)
                    if (res.success) {
                        setTwilioCallState({
                            ...twilioCallState,
                            status: res.status as TwilioCallState['status'],
                            error: null,
                            call_sid: res.call_sid
                        })
                    } else {
                        setTwilioCallState({
                            ...twilioCallState,
                            status: 'failed',
                            error: res.error
                        })
                    }
                }
            }, 3000)
            return () => clearInterval(interval)
        }
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
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '500px', mx: 'auto' }}>
                    <Typography variant='body1' sx={{ textAlign: 'center', mb: 2 }}>
                        🎤 Enter your phone number below.
                        <br />
                        Twilio will call you and play your custom audio!
                    </Typography>

                    <FormGroup>
                        <InputLabel sx={{ mb: 1 }}>Your Phone Number</InputLabel>
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
                            sx={{ mb: 1 }}
                        />
                        <FormHelperText error={phoneNumber.length > 0 && !/^\+?[\d\-()]{10,15}$/.test(phoneNumber)}>
                            {phoneNumber.length > 0 && !/^\+?[\d\-()]{10,15}$/.test(phoneNumber)
                                ? 'Please enter a valid phone number'
                                : ''}
                        </FormHelperText>
                    </FormGroup>

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

                    <Typography
                        variant='body2'
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontStyle: audioUrl ? 'normal' : 'italic'
                        }}
                    >
                        {audioUrl ? '✅ Audio file ready to go!' : '⬆️ Create an audio file first ⬆️'}
                    </Typography>

                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleCallTwilio}
                        disabled={!isAgreed || !audioUrl || !isPhoneValid}
                        size='large'
                        sx={{
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        🚀 Call Yourself
                    </Button>
                </Box>
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
        </>
    )
}
