import { TwilioCallState } from '@/app/api/types/twilioCalls'
import { Box, Typography, Chip, LinearProgress, Alert, Card, CardContent } from '@mui/material'
import { CheckCircle, Phone, Error, AccessTime, PhoneCallback } from '@mui/icons-material'

interface CallStatusCardProps {
    twilioCallState: TwilioCallState
}

export default function CallStatusCard({ twilioCallState }: CallStatusCardProps) {
    const getStatusIcon = () => {
        switch (twilioCallState.status) {
            case 'completed':
                return <CheckCircle sx={{ color: '#4CAF50' }} />
            case 'failed':
                return <Error sx={{ color: '#f44336' }} />
            case 'in-progress':
                return <Phone sx={{ color: '#FF6B9D' }} />
            case 'ringing':
                return <PhoneCallback sx={{ color: '#45E3FF' }} />
            case 'queued':
                return <AccessTime sx={{ color: '#FFE66D' }} />
            default:
                return <AccessTime sx={{ color: '#9E9E9E' }} />
        }
    }

    const getStatusColor = (): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (twilioCallState.status) {
            case 'completed':
                return 'success'
            case 'failed':
                return 'error'
            case 'in-progress':
                return 'primary'
            case 'ringing':
                return 'info'
            case 'queued':
                return 'warning'
            default:
                return 'default'
        }
    }

    const getStatusText = () => {
        switch (twilioCallState.status) {
            case 'completed':
                return 'Call Completed Successfully! 🎉'
            case 'failed':
                return 'Call Failed'
            case 'in-progress':
                return 'Call In Progress...'
            case 'ringing':
                return 'Phone Ringing...'
            case 'queued':
                return 'Call Queued'
            default:
                return 'No Call Made Yet'
        }
    }

    const isCallActive =
        twilioCallState.status === 'queued' ||
        twilioCallState.status === 'ringing' ||
        twilioCallState.status === 'in-progress'

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant='h6'
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    {getStatusIcon()}
                    3. Call Status
                </Typography>
                <Chip
                    label={getStatusText()}
                    color={getStatusColor()}
                    variant={isCallActive ? 'filled' : 'outlined'}
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        animation: isCallActive ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                            '100%': { opacity: 1 }
                        }
                    }}
                />
            </Box>

            {isCallActive && (
                <Box sx={{ width: '100%' }}>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary' }}>
                        Call Progress
                    </Typography>
                    <LinearProgress
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(69,227,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(45deg, #FF6B9D 30%, #45E3FF 90%)'
                            }
                        }}
                    />
                </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {twilioCallState.call_sid && (
                    <Card
                        sx={{
                            background: 'linear-gradient(45deg, rgba(69,227,255,0.1) 0%, rgba(255,107,157,0.1) 100%)',
                            border: '1px solid rgba(69,227,255,0.3)'
                        }}
                    >
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 1 }}>
                                Call Details
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    wordBreak: 'break-all'
                                }}
                            >
                                Call ID: {twilioCallState.call_sid}
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {twilioCallState.error && (
                    <Alert
                        severity='error'
                        sx={{
                            borderRadius: 2,
                            '& .MuiAlert-icon': {
                                color: '#f44336'
                            }
                        }}
                    >
                        <Typography variant='body2'>
                            <strong>Error:</strong> {twilioCallState.error}
                        </Typography>
                    </Alert>
                )}

                {twilioCallState.message && !twilioCallState.error && (
                    <Alert
                        severity='info'
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(69,227,255,0.1)',
                            border: '1px solid rgba(69,227,255,0.3)',
                            '& .MuiAlert-icon': {
                                color: '#45E3FF'
                            }
                        }}
                    >
                        <Typography variant='body2'>{twilioCallState.message}</Typography>
                    </Alert>
                )}

                {!twilioCallState.call_sid && !twilioCallState.error && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            opacity: 0.7
                        }}
                    >
                        <Typography variant='body1' sx={{ mb: 1 }}>
                            📞 Ready for Action!
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                            Complete steps 1 & 2 to see your call status here.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
